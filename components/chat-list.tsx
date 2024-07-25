import { ChatRequestOptions, type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { User } from 'next-auth'
import { LoadingChatMessage } from './loading-message'
import React from 'react'

export interface ChatList {
  messages: Message[],
  user?: User,
  loading?: boolean,
  reload?: ((chatRequestOptions?: ChatRequestOptions | undefined) => Promise<string | null | undefined>) | undefined
}

export function ChatList({ messages, reload, user, loading }: ChatList) {
  if (!messages?.length) {
    return null
  }

  const filteredMessages = messages.filter(msg => msg.role !== 'system')
  
  return (
    <div className="relative mx-auto max-w-[710px] px-4 transition-all duration-100 ease-in-out">
      {filteredMessages.map((message, index) => (
        <React.Fragment key={message.id || index}>
          <div className="min-h-14">
            <ChatMessage
              message={message}
              user={user}
              reload={reload}
              visibleReload={filteredMessages.length >= 2 && index === filteredMessages.length - 2}
            />
          </div>
          {index < filteredMessages.length - 1 && (
            <Separator className="my-2 md:my-5 border-none bg-transparent" />
          )}
        </React.Fragment>
      ))}
      {loading && (
        <div className="mt-4">
          <Separator className="my-2 md:my-5 border-none bg-transparent" />
          <LoadingChatMessage />
        </div>
      )}
    </div>
  )
}
