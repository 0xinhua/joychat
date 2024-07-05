import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { User } from 'next-auth'

export interface ChatList {
  messages: Message[],
  user?: User
}

export function ChatList({ messages, user }: ChatList) {
  if (!messages?.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.filter(msg => msg.role !== 'system').map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} user={user} />
          {index < messages.length - 1 && (
            <Separator className="my-2 md:my-6 border-none bg-transparent" />
          )}
        </div>
      ))}
    </div>
  )
}
