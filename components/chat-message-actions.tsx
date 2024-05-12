'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { IconCopied, IconCopy } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2500 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity md:absolute md:right-9 md:bottom-2 absolute opacity-0',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy} className="hover:bg-transparent">
        {isCopied
        ? <span className="flex items-center gap-x-1 text-[12px] px-2 py-1 bg-white rounded-md dark:bg-gray-600"><IconCopied />Copied</span>
        : <span className="flex items-center gap-x-1 text-[12px] px-2.5 py-1 bg-white/60 hover:bg-white dark:bg-gray-600 rounded-md"><IconCopy />Copy</span>}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
