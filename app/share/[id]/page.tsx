'use client'

import { formatDate } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { FooterText } from '@/components/footer'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Chat } from '@/lib/types'
import { IconLoading } from '@/components/ui/icons'

interface SharePageProps {
  params: {
    id: string
  }
}

export default function SharePage({ params }: SharePageProps) {

  const [chat, setChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const getSharedChat = async () => {
      setLoading(true)
      const resp = await axios(`/api/chats/${params.id}/share`)
      const { data } = resp
      console.log('data share', data)
      setLoading(false)
      if (data?.data) {
        console.log('data?.data',data?.data)
        setChat(data.data)
      }
    }

    getSharedChat()

  }, [])

  useEffect(() => {
    if (chat?.title) {
      document.title = chat.title.toString().slice(0, 50)
    } else {
      document.title = 'Shared Chat - JoyChat'
    }
  }, [chat?.title])

  return (
    <>
     { chat ? <div className="flex-1 space-y-6">
        <div className="px-4 py-6 border-b bg-background md:px-6 md:py-8">
          <div className="max-w-2xl mx-auto md:px-6">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat?.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(Number(chat?.created_at))} · {chat?.messages?.filter(msg => msg?.role !== 'system')?.length} messages
              </div>
            </div>
          </div>
        </div>
        <ChatList messages={chat.messages} />
        <FooterText className="py-8" />
      </div> : loading ? <div className="mx-auto my-10 animate-spin"><IconLoading /></div> : <div className="mx-auto my-10" >{`Share chat: ${params.id} not found. `}</div> }
    </>
  )
}
