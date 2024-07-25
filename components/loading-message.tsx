import { cn } from '@/lib/utils'
import { IconOpenAI } from '@/components/ui/icons'

export function LoadingChatMessage({ ...props }) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(`
          flex size-9 shrink-0 select-none items-center justify-center rounded-2xl dark:border-neutral-800
          bg-primary transition-all border border-gray-100 bg-zinc-100/60 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-950 group-hover:border-gray-200/80 dark:group-hover:border-neutral-700 dark:bg-transparent text-primary-foreground`
        )}
      >
        <IconOpenAI className="h-[20px] w-[20px] text-gray-500 dark:text-gray-300 mb-0.5" />
      </div>
      <div className={cn(`
        animate-pulse
        group transition-all space-y-2 overflow-hidden min-h-[calc(2rem+theme(spacing[3.5]))] min-w-[60px] max-w-16 
        break-words rounded-xl bg-transparent p-4 text-gray-600 
        border-gray-200/40 hover:border-gray-200/60 border ml-4 hover:bg-zinc-50/30 dark:hover:bg-neutral-950/80
        prose-pre:my-2 dark:border-neutral-800 dark:from-transparent dark:text-gray-300 transition-all
      `,
        'flex-1 text-center flex items-center justify-center text-base font-medium border border-gray-100 hover:border-gray-200/80 bg-zinc-100/65 hover:bg-zinc-100 dark:bg-neutral-900/80 dark:hover:bg-neutral-950 hover:bg-zinc-100/80'
      )}>
        <span>...</span>
      </div>
    </div>
  )
}
