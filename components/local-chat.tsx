'use client'

import { type Message } from 'ai/react'

import { cn, nanoid } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import useChatStore from '@/store/useChatStore'
import { defaultModel } from '@/lib/const'
import { Chat as IChat } from '@/lib/types'
import { useLocalChat } from '@/lib/hooks/use-local-chat'
import { LoginDialog } from './login-dialog'
import useUserSettingStore from '@/store/useSettingStore'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages: Message[]
  id?: string
  title?: string
  loading?: boolean
  setInitialMessages?: Dispatch<SetStateAction<Message[]>>
}

export function LocalChat({ id, initialMessages, className, title, setInitialMessages, loading }: ChatProps) {
  const router = useRouter()
  const path = usePathname()

  const { setLoginDialogOpen } = useUserSettingStore()
  const [ userPreInput, setUserPreInput ] = useLocalStorage('user_pre_input', '')
  const [ previewToken, setPreviewToken ] = useLocalStorage<string | null>(
    'openai_api_key',
    null
  )

  const messagesEndRef = useRef(null)

  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false)

  const { chats, setChats } = useChatStore()
  const latestTraceId = useRef<string | null>(null)

  const updatedMessages = useRef<Message[]>([])
  const latestUserMessage = useRef<Message | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const { messages, setMessages, append, reload, stop, isLoading, input, setInput } =
    useLocalChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken: localStorage.getItem('openai_api_key')?.replaceAll(/\"/g, ''),
        model: localStorage.getItem('selected-model')?.replaceAll('"', '') || defaultModel
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
        setIsFetching(false)
      },
      onError(error) {
        setIsFetching(false)
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

        const newMessages = [...(initialMessages || []), ...updatedMessages.current]

        let existingChatIndex = chats.findIndex(chat => chat.chat_id === id);

        if (existingChatIndex !== -1) {
          // Update the existing chat with new messages
          let updatedChats = chats.map((chat, index) => {
            if (index !== existingChatIndex) {
              return chat;
            }
            return {
              ...chat,
              messages: newMessages,
            };
          });
        
          setChats(updatedChats);

        } else {
          // Create a new chat
          const newChat = {
            chat_id: id as string,
            title: input.substring(0, 100),
            created_at: new Date(),
            user_id: '',
            path: `/chat/${id}`,
            messages: newMessages
          }
          setChats([newChat, ...chats]);
        }

        setMessages(newMessages)

        if (!path.includes('chat')) {
          router.replace(`/chat/${id}`)
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrollButtonVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current)
    }

    return () => {
      if (messagesEndRef.current) {
        observer.unobserve(messagesEndRef.current)
      }
    }
  }, [messagesEndRef])

  return (
    <>
      <div className={cn('md:pb-[200px] md:px-4 lg:px-0', className)}>
        { messages.filter(msg => msg.role !== 'system').length ? (
          <>
            <ChatList messages={messages} user={{}} loading={isFetching} />
            <ChatScrollAnchor trackVisibility={isLoading} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} setInitialMessages={setInitialMessages}  />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        messages={messages}
        input={input}
        setInput={setInput}
        isScrollButtonVisible={isScrollButtonVisible}
        onScrollToBottom={() =>
          //@ts-ignore
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        onSubmit={async (value) => {
          if (!localStorage.getItem('openai_api_key')) {
            setLoginDialogOpen(true)
            setUserPreInput(value)
            return
          }
          const userMessage: Message = {
            id: nanoid(),
            content: input,
            role: "user",
          }
          latestUserMessage.current = userMessage
          setIsFetching(true)
          await append(userMessage)
        }}
      />
      <LoginDialog />
    </>
  )
}
