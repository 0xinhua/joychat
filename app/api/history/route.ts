import { auth } from '@/auth'
import { kv } from '@vercel/kv'
import { type Chat } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
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

    const results = await pipeline.exec()

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