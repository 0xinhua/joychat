import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'
import { kv } from '@vercel/kv'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
})
 
export async function POST(req: Request) {

  const userId = (await auth())?.user.id
  // Extract the `prompt` from the body of the request
  const json = await req.json()

  const { messages } = json
 
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
