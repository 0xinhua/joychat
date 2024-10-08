"use client"

import { getDefaultSystemMessage, nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import useUserSettingStore from '@/store/useSettingStore'
import { useEffect, useState } from 'react'
import { LocalChat } from '@/components/local-chat'
import { useMode } from '@/components/mode'
import { useSession } from 'next-auth/react'

export default function IndexPage() {

  const { mode } = useMode()
  const { data: session, status } = useSession()
  const {
    systemPrompt,
    fetchPrompt,
  } = useUserSettingStore()

  const id = nanoid()

  const [initialMessages, setInitialMessages] = useState(getDefaultSystemMessage(systemPrompt))

  useEffect(() => {
    if (mode === 'cloud' && status === 'authenticated') {
      fetchPrompt()
    }
  }, [status])

  return mode === 'cloud' && session?.user ? <Chat
      id={id}
      initialMessages={initialMessages}
      setInitialMessages={setInitialMessages}
  /> : <LocalChat
      id={id}
      initialMessages={initialMessages}
      setInitialMessages={setInitialMessages}
  />
}
