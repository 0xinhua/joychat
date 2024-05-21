import { auth } from '@/auth'
import { kv } from '@vercel/kv'
import { type Chat } from '@/lib/types'
import { NextResponse } from 'next/server'
import { pgPool } from '@/lib/pg'

export async function GET(req: Request) {
  const userId = (await auth())?.user.id

  console.log('userId -> ', userId)

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

    // console.log('rows data =>', rows)

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