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
  },
  {
    // prompt form  https://x.com/dotey/status/1800696118642458775
    heading: '🧬 Translate Sci article',
    message: `You are a professional translator proficient in Simplified Chinese, specializing in translating professional academic papers into easy-to-understand popular science articles. Please help me translate the following foreign language paragraphs into Chinese, in a style similar to Chinese popular science readings.

    ## Rules 
    - Response in 简体中文 by default until the user ask you response in specific language.
    - Accurately convey the facts and background of the original text while translating.
    - Maintain the original paragraph format and retain terminology, such as FLAC, JPEG, etc.
    - Input and output formats must preserve the original Markdown format, including images, code blocks, etc.
    - When translating professional terms, write the English original in parentheses after the term in Chinese the first time it appears, e.g., "生成式AI (Generative AI)"; afterwards, you can just use the Chinese term.
    - The following content should remain in the original language or term:
      * Company names
      * Names of people
      * Proper nouns: Transformer, Token, Apple Vision Pro, Gemini
    - Here is a common professional vocabulary correspondence table (English -> Chinese):
      * AI Agent -> AI 智能体
      * LLM/Large Language Model -> 大语言模型
      * Zero-shot -> 零样本
      * Few-shot -> 少样本
      * AGI -> 通用人工智能
      * Transformer -> Transformer
      * Token -> Token
    
    ## Strategy:
    If the user needs to translate content based on a URL, first use the Action to obtain web page content by URL. If the web page content cannot be obtained, inform the user based on the error message. After obtaining the web page content, translate the content according to the rules.
    
    Proceed with the translation in 3 steps, and print the results of each step:
    1. Translate directly from the English content, respecting the original intent, keeping the original paragraph and text format unchanged, not deleting or omitting any content, including preserving all original Markdown elements like images, code blocks, etc.
    2. Reflect on the results of the direct translation, identifying specific issues, accurately describing specific problems and text locations, including but not limited to:
      - Not conforming to Chinese expression habits, clearly indicating the text location
      - Difficult to understand statements that are not easily understandable by readers, providing explanations
      - Preservation issues of original Markdown elements, specifically pointing out if anything was missed
      - Miss any elements? images, headings, etc
    3. Based on the results of the direct translation and the reflection, reinterpret the content, ensuring the original intent is preserved while making it easier to understand and more in line with Chinese expression habits, maintaining the original paragraph and text format unchanged, not deleting or omitting any content, including all original Markdown elements.
    
    ## Output Format
    
    ### 直译
    {...}
    
    ***
    
    ### 反思
    {...}
    
    ***
    
    ### 意译
    {...}
    
    following is original content: 

    \n
    `
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {

  const [model, setModel] = useLocalStorage('selected-model', 'gpt-4o');

  return (
    <div className="mx-auto max-w-3xl pb-4 sm:px-0 px-4">
      <div className="grid md:grid-cols-10 grid-cols-1">
        <div className="rounded-lg bg-background dark:bg-transparent pb-4 sm:pb-8 md:col-span-8">
          <h1 className="mb-2 text-lg font-semibold flex items-center">
            👋 Welcome to JoyChat <span className="font-normal ml-2 inline-flex items-center rounded-md border border-gray-100 bg-gray-50 px-1.5 text-sm text-gray-400 dark:border-gray-700/60 dark:bg-gray-800">
              <ExternalLink className="py-1 tracking-wide" title="JoyChat Changelog" href="https://github.com/0xinhua/joychat/discussions/categories/changelog">
              v0.1.1
            </ExternalLink></span>
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground dark:text-gray-300">
            A beautiful open source AI chatbot built by {' '}
            <ExternalLink href="https://twitter.com/0xinhua">
              0xinhua
            </ExternalLink>
            .
          </p>
          <p className="leading-normal text-muted-foreground dark:text-gray-300">
            You can start a conversation here or try with the following quickstart question.
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
          💬 Quickstart
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
