import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  chat_id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
  share_path?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
