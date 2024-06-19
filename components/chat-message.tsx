// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconBotAvatar, IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import { IconBot } from '@/components/ui/icons'
import { User } from 'next-auth'

export interface ChatMessageProps {
  message: Message,
  user?: User
}

export function ChatMessage({ message, user, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex size-9 shrink-0 select-none items-center justify-center rounded-2xl border border-gray-100 dark:border-neutral-800',
          message.role === 'user'
            ? 'bg-transparent'
            : 'bg-primary bg-zinc-100/60 dark:bg-transparent text-primary-foreground'
        )}
      >
        { message.role === 'user' ? (user ? <span className="text-gray-500 font-medium dark:text-gray-300">{user?.name?.substring(0, 1)?.toUpperCase()}</span> : <IconUser />)
        : <IconBot className="h-[20px] w-[20px] text-gray-500 dark:text-gray-300 mb-0.5" />}
      </div>
      <div className={cn(`
        group flex-1 ml-4 space-y-2 overflow-hidden min-h-[calc(2rem+theme(spacing[3.5])*2)] min-w-[60px] 
        break-words rounded-xl bg-transparent px-5 py-1 text-gray-600 
        prose-pre:my-2 dark:border-neutral-800 dark:from-transparent dark:text-gray-300 transition-all
      `,
        message.role === 'assistant' && 'py-4 border border-gray-100 bg-zinc-100/60 dark:bg-neutral-900 dark:hover:bg-neutral-950 hover:bg-zinc-100/80'
      )}>
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} className="group-hover:opacity-100" />
      </div>
    </div>
  )
}
