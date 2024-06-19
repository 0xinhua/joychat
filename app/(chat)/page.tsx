"use client"

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import useUserSettingStore from '@/store/useSettingStore'
import { useEffect } from 'react'

export default function IndexPage() {

  const {
    systemPrompt,
    fetchSystemPrompt
  } = useUserSettingStore()

  const id = nanoid()

  useEffect(() => {
    fetchSystemPrompt()
  },[])

  return <Chat
    id={id}
    initialMessages={[{
    id:'system-prompt',
    role: 'system',
    content: systemPrompt || "You are a helpful assistant.",
  }]} />
}
