import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { pgPool } from '@/lib/pg'
import { revalidatePath } from 'next/cache'

export async function GET(req: Request,  { params }: { params: { chatId: string } }) {

  const { chatId } = params
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('chatId userId', chatId, userId)

  try {

    const query = `
    SELECT * 
    FROM chat_dataset.chats
    WHERE user_id = $1 and chat_id =$2;
    `
    const { rows } = await pgPool.query(query, [
      userId,
      chatId
    ])

    if (rows.length === 0) {
      return NextResponse.json({
        data: [],
        code: 0
      })
    }

    return NextResponse.json({
      data: rows[0],
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

export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {

  const { chatId } = params
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('chatId', chatId)

  try {
    const query = `
    DELETE FROM chat_dataset.chats
    WHERE user_id = $1 AND chat_id = $2
    RETURNING *;
    `
    const { rows } = await pgPool.query(query, [
      userId,
      chatId
    ])

    const chat = rows[0]

    // revalidatePath('/')
    revalidatePath(chat.path)

    if (rows.length === 0) {
      return NextResponse.json({
        message: 'Chat not found or not authorized to delete',
        code: 1
      })
    }

    return NextResponse.json({
      message: 'Chat deleted successfully',
      code: 0
    })

  } catch (error) {
    console.log('error', error)
    return NextResponse.json({
      message: 'Error deleting chat',
      code: 1
    })
  }
}