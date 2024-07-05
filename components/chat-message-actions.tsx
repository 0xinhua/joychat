'use client'

import { type Message } from 'ai'

import { IconCopied, IconCopy } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { ChatMessageFeedback } from './chat-message-feedback'
import { useMode } from './mode'
import { usePathname } from 'next/navigation'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2500 })
  const pathname = usePathname()
  console.log('pathname', pathname)

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  const { mode } = useMode()

  return (
    <div
      className={cn(
        `flex items-center space-x-1 px-2.5 max-h-[30px] bg-white dark:bg-neutral-950 border border-gray-200/80 dark:border-neutral-700 justify-end
          md:absolute md:right-3 md:-bottom-4 absolute opacity-0 rounded-lg shadow-sm transition`,
        className
      )}
      {...props}
    >
      <div className="cursor-pointer" onClick={onCopy}>
        {isCopied
        ? <div className="flex items-center gap-x-1 text-[12px] py-1 rounded-md dark:bg-neutral-900"><IconCopied  className="size-3" />Copied</div>
        : <div className="flex items-center gap-x-1 text-[12px] py-1 hover:bg-white dark:bg-neutral-900 rounded-md"><IconCopy className="size-3" />Copy</div>}
        <span className="sr-only">Copy message</span>
      </div>
      { message?.id && mode === 'cloud' && pathname.includes('/chat') ?<ChatMessageFeedback message={message} /> : null}
    </div>
  )
}
