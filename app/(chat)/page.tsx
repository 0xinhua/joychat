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

  useEffect(() => {
    fetchSystemPrompt()
  }, [])

  const id = nanoid()

  return <Chat id={id} initialMessages={[{
    id:'system-prompt',
    role: 'system',
    content: systemPrompt || "You are a helpful assistant.",
  }]} />
}
