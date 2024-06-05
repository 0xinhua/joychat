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
import { IconBard, IconMeta, IconOpenai } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: '💡 Data analysis',
    message: `Summarize the key characteristics of this dataset. Include information on data types, missing values, and basic statistics. The following dataset: 

\n`
  },
  {
    heading: `📖 Summarize content`,
    message: `Summarize content you are provided with for a second-grade student: 

\n`
  },
  {
    heading: '📧 Format and correct email',
    message: `Proofread and format [email]. Also, give suggestions for getting the point across effectively.

[email] following: 

\n`
  },
  {
    heading: '🔠 Translate English',
    message: `You will be provided with statements, and your task is to convert them to standard English.

[statements] following: 

\n`
  },
  {
    heading: '🈳 Translate Chinese',
    message: `You will be provided with statements, and your task is to convert them to simplified Chinese, In the translated text, English words and numbers should be preceded and followed by a space.

[statements] following: 

\n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

  const [model, setModel] = useLocalStorage('selected-model', 'gpt-4o');

  return (
    <div className="mx-auto max-w-3xl pb-4 sm:px-0 px-4">
      <div className="grid md:grid-cols-10 grid-cols-1">
        <div className="rounded-lg bg-background dark:bg-transparent pb-4 sm:pb-8 md:col-span-8">
          <h1 className="mb-2 text-lg font-semibold flex items-center">
            👋 Welcome to JoyChat <span className="font-normal ml-2 inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-2 text-sm text-gray-400 dark:border-gray-700/60 dark:bg-gray-800">v0.1.0</span>
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground dark:text-gray-300">
            A beautiful open source AI chatbot built by {' '}
            <ExternalLink href="https://twitter.com/0xinhua">
              0xinhua
            </ExternalLink>
            .
          </p>
          <p className="leading-normal text-muted-foreground dark:text-gray-300">
            You can start a conversation here or try with the following prompts.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-y-1 leading-normal text-muted-foreground sm:pb-0 pb-4">
          <h1 className="mb-2 text-lg font-semibold text-foreground">✨ Model</h1>
          <Select defaultValue={model} onValueChange={setModel}>
            <SelectTrigger className="w-[154px] shadow-none">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="gpt-4o" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-x-1.5">
                    <IconOpenai />gpt-4o
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-x-1.5">
                    <IconOpenai />gpt-4-turbo
                  </div>
                </SelectItem>
                <SelectItem value="llama3-8b" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-x-1.5">
                    <IconMeta />llama3-8b
                  </div>
                </SelectItem>
                <SelectItem disabled value="gemini-1.5-flash-latest" className="cursor-not-allowed">
                  <div className="flex items-center justify-center gap-x-1.5">
                    <IconBard />
                    <span className="line-clamp-1">gemini-1.5-flash-latest</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="py-2">
        <h1 className="mb-2 text-lg font-semibold">
          💬 Prompts
        </h1>
        <div className="mt-4 grid gap-3 lg:grid-cols-3 lg:gap-5">
          {exampleMessages.map((message, index) => (
            <button
              key={index}
              className="rounded-md border bg-gray-50 p-2.5 px-3 text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-gray-800 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 text-left"
              onClick={() => setInput(message.message)}
            >
              {message.heading}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
