'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { buttonVariants } from '@/components/ui/button'
import { IconChatBubbleLeft, IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()

  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive && newChatId

  if (!chat?.id) return null

  return (
    <motion.div
      className="relative"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      {chat.sharePath ? <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        <Tooltip delayDuration={1000}>
          <TooltipTrigger
            tabIndex={-1}
            className="focus:bg-muted focus:ring-1 focus:ring-ring"
          >
            <IconUsers className="mr-2" />
          </TooltipTrigger>
          <TooltipContent>This is a shared chat.</TooltipContent>
        </Tooltip>
      </div> : null}
      <Link
        href={chat.path}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full font-normal px-2 transition-colors hover:bg-zinc-200 dark:hover:bg-neutral-700',
          isActive && 'bg-zinc-200/60 pr-16 font-semibold dark:bg-neutral-800'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null)
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}
