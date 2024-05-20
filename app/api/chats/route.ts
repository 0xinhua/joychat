import { auth } from '@/auth'
import { kv } from '@vercel/kv'
import { type Chat } from '@/lib/types'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { pgPool } from '@/lib/pg'

export async function GET(req: Request) {
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('userId get ->', userId)

  try {

    const query = `
    SELECT * 
    FROM chat_dataset.chats 
    WHERE user_id = $1 
    ORDER BY updated_at DESC;
    `
    const { rows } = await pgPool.query(query, [
      userId
    ])

    if (rows.length === 0) {
      return NextResponse.json({
        data: [],
        code: 0
      })
    }

    return NextResponse.json({
      data: rows,
      code: 0
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}

export async function POST(req: Request) {
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    if (chats.length === 0) {
      return NextResponse.json({
        data: [],
        code: 0
      })
    }

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results: Chat[] = await pipeline.exec()

    console.log('results',results.length)

    const query = `
    INSERT INTO chat_dataset.chats (chat_id, user_id, title, path, created_at, messages, share_path)
    VALUES (
      $1, 
      $2, 
      $3, 
      $4, 
      $5, 
      $6::jsonb,
      $7
    )
  `;

    for (const chatData of results) {
      const createdAt = chatData.createdAt
      await pgPool.query(query, [
        chatData.id,
        userId,
        chatData.title,
        chatData.path,
        createdAt,
        JSON.stringify(chatData.messages),
        chatData.sharePath
      ]);
      console.log('Data inserted successfully')
    }

  const countResult = await pgPool.query(
    "SELECT * FROM chat_dataset.chats",
  );

  console.log('data==', countResult.rows)

    return NextResponse.json({
      data: results,
      code: 0
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      data: [],
      code: 0
    })
  }
}