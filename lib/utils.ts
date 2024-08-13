import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import { kv } from '@vercel/kv'
import { Message } from 'ai'
import { ModelName, tokenCosts } from './const'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  alphabet,
  7
) // 7-character random string

const customId = customAlphabet(alphabet, 32)

// generate uuid style ID
export const generateUUID = () => {
  const id = customId();
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export interface UsageCostData {
  inputTokens: number;
  outputTokens: number;
}

// Function to calculate and store token values and costs
export async function calculateAndStoreTokensCost(userId: string, plan: string, modelName: string, inputTokens: number, outputTokens: number) {

  const userDataKey = `token:usage:${userId}:${plan}:${modelName}`
  const currentData = await kv.hgetall(userDataKey) as Partial<UsageCostData> || {}
  const currentInputTokens = currentData?.inputTokens ? parseFloat(currentData?.inputTokens.toString()) : 0
  const currentOutputTokens = currentData.outputTokens ? parseFloat(currentData.outputTokens.toString()) : 0

  const newInputTokens = currentInputTokens + inputTokens
  const newOutputTokens = currentOutputTokens + outputTokens

  console.log('totalTokens', newInputTokens, newOutputTokens)

  await kv.hset(userDataKey, {
    inputTokens: newInputTokens,
    outputTokens: newOutputTokens,
  })

  console.log(`usage cost saved userId: ${userId} newTotalTokens`, newInputTokens, newOutputTokens)
}

export const getDefaultSystemMessage = (systemPrompt: string): Message[] => ([{
  id: nanoid(),
  role: 'system',
  content: systemPrompt || "You are a helpful assistant.",
}])

export function calculateUserCost(model: ModelName, inputTokens: number, outputTokens: number): number {

  const modelCosts = tokenCosts[model]
  if (!modelCosts) {
    throw new Error(`Model ${model} not found in tokenCosts`)
  }

  const inputCost = (inputTokens / 1_000_000) * modelCosts.inputCostPerMillion
  const outputCost = (outputTokens / 1_000_000) * modelCosts.outputCostPerMillion
  const totalCost = inputCost + outputCost

  return totalCost
}