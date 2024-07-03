'use client'

import { useChat, type Message } from 'ai/react'

import { cn, nanoid } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useChatStore from '@/store/useChatStore'
import { defaultModel, useLangfuse } from '@/lib/const'
import { Chat as IChat } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { LoginDialog } from './login-dialog'
import { useToast } from "@/components/ui/use-toast"

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages: Message[]
  id?: string
  title?: string
  loading?: boolean
}

export function Chat({ id, initialMessages, className, title, loading }: ChatProps) {

  const router = useRouter()
  const path = usePathname()
  const { toast } = useToast()

  const { fetchChats } = useChatStore()
  const { data: session, status } = useSession()
  const latestTraceId = useRef<string | null>(null)

  const updatedMessages = useRef<Message[]>([]);
  const latestUserMessage = useRef<Message | null>(null);

  const { messages, setMessages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        model: localStorage.getItem('selected-model')?.replaceAll('"', '') || defaultModel
      },
      sendExtraMessageFields: true,
      onResponse(response) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "You need to log in to authorize your account.",
          })
        }
        if (useLangfuse) {
          const newTraceId = response.headers.get("X-Trace-Id")
          latestTraceId.current = newTraceId
        }
        if (response.status !== 200 ) {
          console.log(response)
          toast({
            title: "Chat completion failed",
            description: response?.statusText,
          })
        }
      },
      onFinish(message: Message) {

        if (latestUserMessage.current) {
          updatedMessages.current.push({
            ...latestUserMessage.current,
            id: latestUserMessage.current.id ?? nanoid(),
          })
          latestUserMessage.current = null
        }
        updatedMessages.current.push({
          ...message,
          id: latestTraceId.current ?? message.id,
        })
  
        setMessages([...(initialMessages || []), ...updatedMessages.current])

        if (!path.includes('chat')) {
          router.replace(`/chat/${id}`)
          fetchChats()
          // router.refresh()
        }
      }
    })

  useEffect(() => {
    if (title) {
      document.title = title.toString().slice(0, 50)
    } else {
      document.title = 'New Chat - JoyChat'
    }
  }, [title])

  return (
    <>
      <div className={cn('md:pb-[200px] md:px-4 lg:px-0', className)}>
        { messages.filter(msg => msg.role !== 'system').length ? (
          <>
            <ChatList messages={messages} user={session?.user || {}} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        onSubmit={async (value) => {
          const userMessage: Message = {
            id: nanoid(),
            content: input,
            role: "user",
          }
          latestUserMessage.current = userMessage
          await append(userMessage)
        }}
      />
       <LoginDialog />
    </>
  )
}
