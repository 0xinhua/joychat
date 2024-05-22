import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message } from 'ai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { pgPool } from '@/lib/pg'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
})

export async function POST(req: Request) {
  const json = await req.json()

  let { messages, previewToken, model } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  console.log('model', model)

  // use google gemini provider
  if (model.startsWith('gemini')) {

    console.log('gemini model')

    const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(buildGoogleGenAIPrompt(messages))

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream, {
      onCompletion: async (completion: string) => {
        // This callback is called when the completion is ready
        // You can use this to save the final completion to your database
        const title = messages[0].content.substring(0, 100)
        const id = json.id ?? nanoid()
        const createdAt = Date.now()
        const path = `/chat/${id}`
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant'
            }
          ]
        }

        await kv.hmset(`chat:${id}`, payload)
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        })
      },
    })

    // Respond with the stream
    return new StreamingTextResponse(stream)
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  if (model === 'gpt-4') {
    model = 'gpt-4-turbo'
  }

  const res = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const chatId = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${chatId}`
      const newMessage = {
        content: completion,
        role: 'assistant',
      }

      const updatedMessages = JSON.stringify([
        ...messages,
        newMessage,
      ])

      // 插入数据或更新 messages 字段
        const query = `
        INSERT INTO chat_dataset.chats (chat_id, title, user_id, created_at, path, messages, share_path)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (chat_id) DO UPDATE
        SET messages = EXCLUDED.messages
      `
      const values = [
        chatId,
        title,
        userId,
        createdAt,
        path,
        updatedMessages,
        null, // Assuming share_path is null for now
      ]

      try {
        await pgPool.query(query, values)
        console.log(`Chat ${chatId} inserted or updated successfully`)
      } catch (err) {
        console.error('Error inserting or updating chat:', err)
      }
    }
  })

  return new StreamingTextResponse(stream)
}
