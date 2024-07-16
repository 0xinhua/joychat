import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { Message } from 'ai'
import { encodingForModel } from "js-tiktoken"

import { auth } from '@/auth'
import { calculateAndStoreTokensCost, nanoid } from '@/lib/utils'
import { plans, useLangfuse } from '@/lib/const'
import langfuse from '@/lib/langfuse'
import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

let trace: any, generation: any, messageId: string

async function handleCompletion(completion: string, messages: Message[], id: string, userId: string, messageId: string, model: string) {

  const nonSystemMessages = messages.filter((message: Message) => message.role !== 'system')
  const firstNonSystemMessage = nonSystemMessages.find((message: Message) => message.role !== 'system')

  const title = firstNonSystemMessage ? firstNonSystemMessage.content.substring(0, 100) : messages[0].content.substring(0, 100)
  const chatId = id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${chatId}`
  const newMessage = {
    content: completion,
    role: 'assistant',
    id: messageId
  }

  const updatedMessages = [
    ...messages,
    newMessage,
  ]

  try {
    const startTime = Date.now()

    console.time('upsert_chat')
    // see README function upsert_chat definition
    const { data: rows, error } = await supabase.rpc('upsert_chat', {
      p_chat_id: chatId,
      p_title: title,
      p_user_id: userId,
      p_created_at: createdAt,
      p_path: path,
      p_messages: updatedMessages,
      p_share_path: null,
      p_current_model_name: model
    })

    console.timeEnd('upsert_chat')

    const endTime = Date.now()
    const executionTime = endTime - startTime

    console.log(`Execution Time: ${executionTime} ms`)
    console.log(`upsert chat ${chatId} data `, rows, error)

  } catch (err) {
    console.error('Error inserting or updating chat:', err)
  }
}

export const maxDuration = 59

export async function POST(req: Request) {

  const json = await req.json()

  let { messages, previewToken, model, id } = json
  const user = (await auth())?.user

  if (!user || !user?.id) {
    return new Response('Unauthorized', {
      status: 401
    })
  }  

  const { id: userId, plan = 'free' } = user

  console.log('model chatId userId: ', model, id, userId, plan)

  const startTime = Date.now() // startTime

  const record = await kv.hmget(`token:usage:${userId}`, 'inputTokens', 'outputTokens')

  console.log('user token usage record: ', record)

  console.time('tokenUsageCheck')

  if (record) {

    const { inputTokens, outputTokens} = record as { inputTokens: number; outputTokens: number }

    if (inputTokens && outputTokens) {

      const totalTokens = Number(inputTokens) + Number(outputTokens)

      console.log('user totalTokens: ', totalTokens)

      console.log('plan', plan, totalTokens, plans[plan]['tokenLimit'])
      if (totalTokens && Number(totalTokens) as number > plans[plan]['tokenLimit']) {
        console.log(`${plan} plan Token limit exceeded`);
        return NextResponse.json({ }, {
          status: 500,
          statusText: `You have reached the usage limit of ${plan} plan. If you need more free credits, please email the administrator at support@joychat.io .`
        })
      }
    }
  }

  console.timeEnd('tokenUsageCheck')

  const endTime = Date.now() // endTime
  console.log(`Query execution time: ${endTime - startTime} ms`)

  // remove id from message
  const newMessages = messages.map(({role, content}: Message) => {
    return {
      content,
      role
    }
  })

  if (useLangfuse) {
    trace = langfuse.trace({
      name: "chat",
      sessionId: "joychat.conversation." + id,
      userId: userId,
      metadata: {
        chatId: id,
        pathname: new URL(req.headers.get("Referer") as string).pathname,
        model,
        userId: userId,
        user: user.name || ''
      },
      tags: [process.env.NODE_ENV],
    })

    generation = trace.generation({
      name: "generation",
      input: newMessages as any,
      model,
    })
  }

  console.log('trace.id message useLangfuse', trace?.id, useLangfuse)

  messageId = useLangfuse ? trace?.id : nanoid()

  if (previewToken) {
    openai.apiKey = previewToken
  }

  if (model === 'gpt-4') {
    model = 'gpt-4-turbo'
  }

  const enc = encodingForModel(model);  // js-tiktoken

  const promptTokens = messages.reduce(
    (total: number, msg: Message) => total + enc.encode(msg.content ?? '').length,
    0,
  )

  console.log('promptTokens', promptTokens)

  const res = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    stream: true
  })

  let completionTokens = 0;

  const stream = OpenAIStream(res, {
    onStart: () => {
      if (useLangfuse) {
        generation.update({
          completionStartTime: new Date(),
        })
      }
    },
    onToken: (content) => {
      const tokenList = enc.encode(content);
      completionTokens += tokenList.length;
    },
    onFinal: async () => {
      console.log(`completionTokens: ${completionTokens}`);
      console.time('totalExecutionTime');
      await calculateAndStoreTokensCost(userId, promptTokens, completionTokens)
      console.timeEnd('totalExecutionTime');
    },
    async onCompletion(completion) {
      console.time('useLangfuseGeneration');
      if (useLangfuse) {
        generation.end({
          output: completion,
          level: completion.includes("I don't know how to help with that")
            ? "WARNING"
            : "DEFAULT",
          statusMessage: completion.includes("I don't know how to help with that")
            ? "Refused to answer"
            : undefined,
        })
      }
      console.timeEnd('useLangfuseGeneration');
      console.time('handleCompletion')
      handleCompletion(completion, messages, id, userId, messageId, model)
      console.timeEnd('handleCompletion')
      if (useLangfuse) {
        await langfuse.shutdownAsync()
      }
    }
  })

  return new StreamingTextResponse(stream, {
    headers: {
      "X-Trace-Id": trace?.id || messageId,
    },
  })
}