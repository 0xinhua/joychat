import { ChatRequestOptions, type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { User } from 'next-auth'

export interface ChatList {
  messages: Message[],
  user?: User,
  reload: ((chatRequestOptions?: ChatRequestOptions | undefined) => Promise<string | null | undefined>) | undefined
}

export function ChatList({ messages, reload, user }: ChatList) {
  if (!messages?.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.filter(msg => msg.role !== 'system').map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} user={user} reload={reload} visibleReload={messages.length >= 2 && index === messages.length - 2} />
          {index < messages.length - 1 && (
            <Separator className="my-2 md:my-6 border-none bg-transparent" />
          )}
        </div>
      ))}
    </div>
  )
}
