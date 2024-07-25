import * as React from 'react'
import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconAlert, IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'isLoading'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
  title?: string
  onSubmit: (value: string) => void,
  onScrollToBottom: () => void,
  isScrollButtonVisible: boolean
}

export function ChatPanel({
  id,
  title,
  isLoading,
  stop,
  input,
  setInput,
  messages,
  onSubmit,
  onScrollToBottom,
  isScrollButtonVisible
}: ChatPanelProps) {
  const { isSidebarOpen } = useSidebar()

  return (
    <div className={cn(`fixed bottom-0 inset-x-0 md:bottom-4 w-full from-muted/30
      from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out
      dark:from-background/10 dark:from-10%
      dark:to-background/80`,
      isSidebarOpen && 'lg:pl-[240px] xl:pl-[256px]'
      )}>
      <div className="mx-auto sm:max-w-3xl">
        <div className="flex items-center justify-center md:h-12 h-10 mb-2">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background shadow-none"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (messages?.filter(msg => msg.role !== 'system').length >= 2
          ? (<ButtonScrollToBottom onClick={onScrollToBottom} visible={isScrollButtonVisible} />) : null)
          }
        </div>
        <div className="p-2 space-y-4 border border-x-0 md:py-2 sm:mb-2
          relative flex w-full max-w-4xl flex-1 items-center sm:rounded-xl md:border bg-gray-100 focus-within:border-gray-300 dark:border-gray-600 dark:bg-neutral-800 dark:focus-within:border-gray-500
        ">
          <PromptForm
            onSubmit={async value => {
              onSubmit(value)
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
        {messages?.filter(msg => msg.role !== 'system').length ? <span className="text-xs hidden sm:flex py-1 text-gray-400/90 flex items-center justify-center ">AI generated content may be inaccurate or false.</span> : null}
      </div>
    </div>
  )
}
