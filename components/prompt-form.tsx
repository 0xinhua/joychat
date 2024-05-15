import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      className="w-full"
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow sm:rounded-lg sm:px-1">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything"
          spellCheck={false}
          className="min-h-[30px] w-full resize-none bg-transparent px-1 py-2 focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-1 bottom-0 mb-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="shadow-none"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Ask me anything</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click to send or press Enter</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
