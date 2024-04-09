import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

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
  return (
    <div className="mx-auto max-w-3xl pb-4">
      <div className="rounded-lg bg-background pb-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to JoyChat
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chatbot app built by {' '}
          <ExternalLink href="https://twitter.com/0xinhua">
            0xinhua
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try with the following prompts.
        </p>
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
