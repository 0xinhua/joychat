'use client'

import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

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
import { IconGoogle, IconOpenai } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: '💡 Data analysis',
    message: `Summarize the key characteristics of this dataset. Include information on data types, missing values, and basic statistics. The following dataset: \n `
  },
  {
    heading: '📖 Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: '📧 Format and correct email',
    message: `Proofread and format [email]. Also, give suggestions for getting the point across effectively.

[email] following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

  const [model, setModel] = useLocalStorage('selected-model', 'gpt-4');

  return (
    <div className="mx-auto max-w-3xl pb-4 sm:px-0 px-4">
      <div className="grid md:grid-cols-10 grid-cols-1">
        <div className="rounded-lg bg-background pb-8 md:col-span-7">
          <h1 className="mb-2 text-lg font-semibold">
            Welcome to JoyChat <span className="font-normal ml-2 inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-2 text-sm text-gray-400 dark:border-gray-700/60 dark:bg-gray-800">v0.0.1</span>
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground">
            This is an open source AI chatbot built by {' '}
            <ExternalLink href="https://twitter.com/0xinhua">
              0xinhua
            </ExternalLink>
            .
          </p>
          <p className="leading-normal text-muted-foreground">
            You can start a conversation here or try with the following prompts.
          </p>
        </div>
        <div className="col-span-1 md:col-span-3 flex flex-col gap-y-1 leading-normal text-muted-foreground">
          <span className="text-base">Model</span>
          <Select defaultValue={model} onValueChange={setModel}>
            <SelectTrigger className="w-[160px] shadow-none">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="gpt-4" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-x-1"><IconOpenai />GPT-4</div>
                </SelectItem>
                <SelectItem value="gemini-1.5-pro" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-x-1 cursor-pointer"><IconGoogle />Gemini-pro</div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="py-2">
        <div className="mt-4 grid gap-3 lg:grid-cols-3 lg:gap-5">
          {exampleMessages.map((message, index) => (
            <button
              key={index}
              className="rounded-md border bg-gray-50 p-2.5 px-3 text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-left"
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
