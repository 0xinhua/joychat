"use client"

import * as React from 'react'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { useEffect } from 'react'
import useChatStore from '@/store/useChatStore'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { IconPlus } from './ui/icons'
import { Session } from 'next-auth'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface ChatHistoryProps {
  userId?: string,
  session?: Session
}

export function ChatHistory({ userId, session }: ChatHistoryProps) {
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  const { chats } = useChatStore()

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 my-4 mt-10 md:mt-4 lg:hidden flex">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'border',
            'h-9 w-full justify-start bg-gray-50 font-normal bg-gray-50 px-3 shadow-none transition-colors text-gray-600 hover:bg-gray-100 max-xl:text-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
        >
          <IconPlus className="-translate-x-1 stroke-2" />
          New Chat
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <SidebarList userId={userId} chats={chats} session={session} />
        {/* sidebar toggle */}
        <div className="fixed left-0 top-1/2 z-40 transform xl:translate-x-[256px] lg:translate-x-[220px] translate-y-[-32px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
              <button onClick={() => {
                toggleSidebar()
              }} className="absolute inset-y-0 z-10 my-auto left-0 *:transition-transform group flex h-16 w-6 flex-col items-center justify-center -space-y-1 outline-none *:h-3 *:w-1 *:rounded-full *:hover:bg-gray-400 max-md:hidden dark:*:hover:bg-gray-400 *:bg-gray-200 dark:*:bg-gray-500">
                  <div className={cn(isSidebarOpen ? "group-hover:rotate-[20deg]": "group-hover:-rotate-[20deg]")}></div>
                  <div className={cn(isSidebarOpen ? "group-hover:-rotate-[20deg]": "group-hover:rotate-[20deg]")}></div>
                  <span className="sr-only">Toggle Sidebar</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p className="z-2">{isSidebarOpen ? 'Fold Sidebar' : 'Unfold Sidebar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </React.Suspense>
    </div>
  )
}
