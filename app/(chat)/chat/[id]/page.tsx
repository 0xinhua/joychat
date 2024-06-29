"use client"

import mixpanel from 'mixpanel-browser'

import { Chat } from '@/components/chat'
import { LocalChat } from '@/components/local-chat'
import React, {Suspense, useEffect, useState} from 'react'
import useChatStore from '@/store/useChatStore'
import { useSession } from "next-auth/react"
import { useMode } from '@/components/mode'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {

  const { data: session, status } = useSession()
  const { mode } = useMode()

  mixpanel.init('aa4a031ffe173cb6eeb91bac9aa81f19', { debug: true, track_pageview: true, persistence: 'localStorage' })

  const [loading, setLoading] = useState(false)
  const { chat, setChat, chats, chatLoading, fetchChatById } = useChatStore()

  useEffect(() => {
    setLoading(true)
    const targetChat = chats.find(chat => chat.chat_id === params.id)
    if (targetChat) {
      setChat(targetChat)
    }
    setLoading(false)
  }, [])

  useEffect(() => {

    const fetchChat = async () => {
      setLoading(true)
      mode === 'cloud' && session?.user && fetchChatById(params.id)
      setLoading(false)
    }

    if (status === 'authenticated') {

      fetchChat()

      if (session?.user) {

        mixpanel.identify(session?.user.id)
        mixpanel.people.set({
          id: session?.user.id,
          name: session.user.name,
          email: session.user.email
        })
      }

      mixpanel.track('Chat Page', {
        distinct_id: session?.user.id
      })
    }
  }, [status])

  return <div>
    <Suspense>
      {
        loading
        ? <div className="text-center text-gray-400 flex justify-center gap-1 items-center">
          Loading
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-gray-400 size-4">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        : (mode === 'cloud' && session?.user ? <Chat
          id={params.id}
          initialMessages={chat?.messages || []}
          title={chat?.title}
          loading={chatLoading}
        /> : <LocalChat
        id={params.id}
        initialMessages={chat?.messages || []}
        title={chat?.title}
      />)
      }
    </Suspense>
  </div>
}
