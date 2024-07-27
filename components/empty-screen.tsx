'use client'

import { UseChatHelpers } from 'ai/react'
import { ExternalLink } from '@/components/external-link'

import { quickstartMessages } from '@/lib/const'
import { ModelSelect } from './model-select'

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

  return (
    <div className="mx-auto max-w-3xl pb-4 px-4 md:px-2">
      <div className="grid md:grid-cols-10 grid-cols-1">
        <div className="rounded-lg bg-background dark:bg-transparent pb-4 sm:pb-8 md:col-span-8">
          <h1 className="mb-2 text-lg font-semibold flex items-center">
            👋 Welcome to JoyChat <span className="font-normal ml-2 inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-1.5 text-sm text-gray-400 dark:border-gray-700/60 dark:bg-zinc-800">
              <ExternalLink className="py-1 tracking-wide" title="JoyChat Changelog" href="https://github.com/0xinhua/joychat/discussions/categories/changelog">
              v0.2.0
            </ExternalLink></span>
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground dark:text-gray-300">
            I’m here to be your friendly AI companion 😊.
          </p>
          <p className="leading-normal text-muted-foreground dark:text-gray-300">
          Let&apos;s chat about anything on your mind, or try one of quickstart questions.
          </p>
        </div>
        <ModelSelect />
      </div>
      <div className="py-2">
        <h1 className="mb-2 text-lg font-semibold">
          💬 Quickstart
        </h1>
        <div className="mt-4 grid gap-3 lg:grid-cols-3 md:grid-cols-2 lg:gap-5">
          { quickstartMessages.map((message, index) => (
            <button
              title={message.message}
              key={index}
              className="rounded-md border bg-gray-50 p-2.5 px-3 text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-[#3e3e3e] dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 text-left"
              onClick={() => setInput(message.message)}
            >
              { message.heading }
            </button>
          )) }
        </div>
      </div>
    </div>
  )
}
