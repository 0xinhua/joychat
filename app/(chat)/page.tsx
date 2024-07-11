"use client"

import { getDefaultSystemMessage, nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import useUserSettingStore from '@/store/useSettingStore'
import { useEffect } from 'react'
import { LocalChat } from '@/components/local-chat'
import { useMode } from '@/components/mode'
import { useSession } from 'next-auth/react'

export default function IndexPage() {

  const { mode } = useMode()
  const { data: session, status } = useSession()
  const {
    systemPrompt,
    fetchSystemPrompt,
    getSystemPrompt
  } = useUserSettingStore()

  const id = nanoid()

  const initialMessages = getDefaultSystemMessage(systemPrompt)

  useEffect(() => {
    getSystemPrompt()
    mode === 'cloud' && session?.user && fetchSystemPrompt()
  },[])

  return mode === 'cloud' && session?.user ? <Chat
      id={id}
      initialMessages={initialMessages}
  /> : <LocalChat
      id={id}
      initialMessages={initialMessages}
  />
}
