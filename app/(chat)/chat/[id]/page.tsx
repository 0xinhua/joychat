"use client"

import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Mixpanel from 'mixpanel'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import React, {Suspense, useEffect, useState} from 'react'
import useChatStore from '@/store/useChatStore'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  // const session = await auth()

  // if (!session?.user) {
  //   redirect(`/sign-in?next=/chat/${params.id}`)
  // }

  // const chat = await getChat(params.id, session.user.id)

  // if (!chat) {
  //   notFound()
  // }

  // if (chat?.user_id !== session?.user?.id) {
  //   notFound()
  // }

  // const mixpanel = Mixpanel.init('aa4a031ffe173cb6eeb91bac9aa81f19', { debug: true })

  // mixpanel.people.set(session?.user.id, {
  //   $name: session.user.name,
  //   $email: session.user.email
  // })

  // mixpanel.track('Chat Page', {
  //   distinct_id: session?.user.id
  // })

  const [loading, setLoading] = useState(false)
  const { chat, chatLoading, fetchChatById } = useChatStore()

  useEffect(() => {
    const fetchChat = async () => {
      setLoading(true)
      fetchChatById(params.id)
      setLoading(false)
    }
      fetchChat()
    },
  [])

  return <div>
    <Suspense>
      {loading ? <div className="text-center text-gray-400 flex justify-center gap-1 items-center">
      Loading
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-gray-400 size-4">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      </div> : <Chat id={params.id} initialMessages={chat?.messages} title={chat?.title} loading={chatLoading} />}
    </Suspense>
  </div>
}
