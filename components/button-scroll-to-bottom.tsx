'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconArrowDown } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export interface ButtonScrollProps {
  className?: string;
  onClick?: () => void;
  visible: boolean
}

export function ButtonScrollToBottom({ className, onClick, visible, ...props }: ButtonScrollProps) {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'z-10 bg-background dark:bg-neutral-900 transition-opacity duration-200 shadow-none dark:border-gray-600',
            visible ? 'opacity-1 cursor-pointer': 'opacity-0 cursor-default',
            className
          )}
          onClick={onClick}
          {...props}
        >
          <IconArrowDown />
          <span className="sr-only">Scroll to bottom</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className={cn(
        visible ? 'opacity-1': 'opacity-0',
      )}>
        Scroll to bottom
      </TooltipContent>
    </Tooltip>
  )
}
