'use client'

import { UseChatHelpers } from 'ai/react'
import { ExternalLink } from '@/components/external-link'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { defaultModel, models, quickstartMessages } from '@/lib/const'

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

  const [model, setModel] = useLocalStorage('selected-model', defaultModel)

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
            Your personal AI assistant, let&apos;s chat about anything on your mind.
          </p>
          <p className="leading-normal text-muted-foreground dark:text-gray-300">
            Ask me for advice, answers, etc, or try one of our quickstart questions.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-y-1 leading-normal text-muted-foreground sm:pb-0 pb-4">
          <h1 className="mb-2 text-lg font-semibold text-foreground">✨ Model</h1>
          <Select defaultValue={model} onValueChange={setModel}>
            <SelectTrigger className="w-[154px] shadow-none">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="dark:bg-zinc-900">
              <SelectGroup>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value} className={model.disabled ? 'cursor-not-allowed' : 'cursor-pointer dark:hover:bg-zinc-800'} disabled={model.disabled}>
                    <div className="flex items-center justify-center gap-x-1.5">
                      {<model.icon />}
                      <span className="line-clamp-1">{model.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
              className="rounded-md border bg-gray-50 p-2.5 px-3 text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-gray-800 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 text-left"
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
