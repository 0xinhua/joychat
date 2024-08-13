'use client'

import { Message, UseChatHelpers } from 'ai/react'
import { ExternalLink } from '@/components/external-link'

import { ModelSelect } from './model-select'
import useUserSettingStore from '@/store/useSettingStore'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { getDefaultSystemMessage } from '@/lib/utils'

export function EmptyScreen({ setInput, setInitialMessages }: Pick<UseChatHelpers, 'setInput'> & { setInitialMessages?: (messages: Message[]) => void }) {

  const {
    customPrompts,
  } = useUserSettingStore()

  return (
    <div className="mx-auto max-w-3xl pb-4 px-4 md:px-2">
      <div className="grid md:grid-cols-10 grid-cols-1">
        <div className="rounded-lg bg-background dark:bg-transparent pb-4 sm:pb-8 md:col-span-8">
          <h1 className="mb-2 text-lg font-semibold flex items-center">
            👋 Welcome to JoyChat <span className="font-normal ml-2 inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-1.5 text-sm text-gray-400 dark:border-gray-700/60 dark:bg-zinc-800">
              <ExternalLink className="py-1 tracking-wide" title="JoyChat Changelog" href="https://github.com/0xinhua/joychat/discussions/categories/changelog">
              v0.3.0
            </ExternalLink></span>
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground dark:text-gray-300">
            I’m your friendly AI companion.
          </p>
          <p className="leading-normal text-muted-foreground dark:text-gray-300">
          Let&apos;s chat about anything on your mind.
          </p>
        </div>
        <ModelSelect />
      </div>
      <div className="py-2">
        <h1 className="mb-2 text-lg font-semibold">
          💬 Prompts <Badge className="bg-[#ADFA1D] text-primary hover:bg-[#ADFA1D]/60">New</Badge>
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground dark:text-gray-300">
          Try a quickstart prompt or customize your own in <Link href='/settings/prompt' className="underline underline-offset-4 decoration-1 hover:decoration-2" title="setting custom prompts">
          <Settings className="size-3.5 mr-0.5 inline" />settings</Link>.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3 md:grid-cols-2 lg:gap-5">
          { customPrompts?.map((message, index) => (
            <button
              title={message.user_message}
              key={index}
              className="rounded-md border bg-gray-50 p-2.5 px-3 text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-[#3e3e3e] dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 text-left"
              onClick={() => {
                if (message.system_prompt && setInitialMessages) {
                  const initialMessages = getDefaultSystemMessage(message.system_prompt)
                  setInitialMessages(initialMessages)
                }
                setInput(message.user_message)
              }}
            >
              { message.heading }
            </button>
          )) }
        </div>
      </div>
    </div>
  )
}
