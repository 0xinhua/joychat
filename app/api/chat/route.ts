import { auth } from '@/auth'
import { calculateAndStoreTokensCost, nanoid } from '@/lib/utils'
import { ModelName, PlanName, plans, useLangfuse } from '@/lib/const'
import langfuse from '@/lib/langfuse'
import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

import { openai } from '@ai-sdk/openai'
import { streamText, convertToCoreMessages, Message } from 'ai'

// export const runtime = 'edge'

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

  const userDataKey = `token:usage:${userId}:${plan}:${model}`

  console.time('tokenUsageCheck')

  const record = await kv.hmget(userDataKey, 'inputTokens', 'outputTokens')

  console.log('user token usage record: ', record)

  const modelName = model as ModelName
  const planName = plan as PlanName

  if (record) {

    const { inputTokens, outputTokens} = record as { inputTokens: number; outputTokens: number }

    if (inputTokens && outputTokens) {

      const totalTokens = Number(inputTokens) + Number(outputTokens)

      console.log('user totalTokens: ', totalTokens)

      const planLimits = plans[planName][modelName]
      console.log('plan', plan, totalTokens, planLimits.tokenLimit)

      if (totalTokens && Number(totalTokens) as number > planLimits.tokenLimit) {
        console.log(`${plan} plan Token limit exceeded`)
        return NextResponse.json({ }, {
          status: 500,
          statusText: `You have reached the ${modelName} model usage limit of ${plan} plan. If you need more free credits, please email the administrator at support@joychat.io .`
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
    console.log('useLangfuse model', model)
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

  const res = await streamText({
    model: openai(model),
    messages: convertToCoreMessages(messages),
    temperature: 0.7,
    async onFinish({ text, toolCalls, toolResults, finishReason, usage, rawResponse  }) {
      // your own logic, e.g. for saving the chat history or recording usage
      console.log('onFinish, text, usage:', text, usage)
      const { promptTokens, completionTokens } = usage
      await handleCompletion(text, messages, id, userId, messageId, model)
      await calculateAndStoreTokensCost(userId, planName, modelName, promptTokens, completionTokens)

      console.time('useLangfuseGeneration')
      if (useLangfuse) {
        generation.end({
          output: text,
          level: text.includes("I don't know how to help with that")
            ? "WARNING"
            : "DEFAULT",
          statusMessage: text.includes("I don't know how to help with that")
            ? "Refused to answer"
            : undefined,
        })
      }
      console.timeEnd('useLangfuseGeneration')
      if (useLangfuse) {
        await langfuse.shutdownAsync()
      }
    },
  })

  return res.toDataStreamResponse({
    init: {
      headers: {
        "X-Trace-Id": trace?.id || messageId,
      }
    }
  })
}