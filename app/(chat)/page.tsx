"use client"

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import useUserSettingStore from '@/store/useSettingStore'

export default function IndexPage() {

  const {
    systemPrompt,
  } = useUserSettingStore()

  const id = nanoid()

  return <Chat
    id={id}
    initialMessages={[{
    id:'system-prompt',
    role: 'system',
    content: systemPrompt || "You are a helpful assistant.",
  }]} />
}
