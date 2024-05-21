'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { pgPool } from '@/lib/pg'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(chatId: string, userId: string) {

  console.log('chat ->', chatId, userId)

  const query = `
  SELECT * 
  FROM chat_dataset.chats
  WHERE user_id = $1 and chat_id =$2;
  `
  const startTime = Date.now() // 记录开始时间
  const { rows } = await pgPool.query(query, [
    userId,
    chatId
  ])

  const endTime = Date.now() // 记录结束时间
  console.log(`Query execution time: ${endTime - startTime} ms`) // 计算并打印查询执行时间

  return rows[0]
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const query = `
  DELETE FROM chat_dataset.chats 
  WHERE user_id = $1;
  `
  await pgPool.query(query, [session?.user?.id])

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  const queryStr = `
  SELECT * 
  FROM chat_dataset.chats
  WHERE chat_id =$1;
  `

  const { rows } = await pgPool.query(queryStr, [
    id
  ])

  if (!rows || !rows?.length) {
    return null
  }

  return rows[0]
}

export async function shareChat(id: string) {
  const session = await auth()

  console.log('share id', id)

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const userId = session?.user?.id

  const queryStr = `
  SELECT * 
  FROM chat_dataset.chats
  WHERE user_id = $1 and chat_id =$2;
  `

  const { rows } = await pgPool.query(queryStr, [
    userId,
    id
  ])

  if (!rows || !rows?.length) {
    return {
      error: 'The chat has since been removed'
    }
  }

  if (rows[0].user_id !== userId) {
    return {
      error: 'You do not have permission to share this chat'
    }
  }

  const sharePath = `/share/${id}`

  const query = `
  UPDATE chat_dataset.chats
  SET share_path = $1
  WHERE chat_id = $2
  AND user_id = $3 
  RETURNING *;
  `
  const { rows: updatedRows } = await pgPool.query(query, [sharePath, id, userId])

  console.log('updatedRows', updatedRows[0])

  return updatedRows[0]
}
