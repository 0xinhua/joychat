import { Message } from "ai"

export interface Chat extends Record<string, any> {
  id?: string
  chat_id: string
  title: string
  created_at: Date
  user_id?: string
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

export type Feedback = "positive" | "negative"
