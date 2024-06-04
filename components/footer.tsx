import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      <a
        target="_blank"
        className="inline-flex underline-offset-2 flex-1 justify-center gap-1 leading-4 underline"
        href="https://github.com/0xinhua/joychat">JoyChat</a> - An open source AI chatbot built by{' '} 0xinhua.
    </p>
  )
}
