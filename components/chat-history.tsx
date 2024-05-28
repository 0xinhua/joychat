"use client"

import * as React from 'react'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { useEffect, useState } from 'react'
import useChatStore, { ChatState } from '@/store/useChatStore'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { IconPlus } from './ui/icons'

interface ChatHistoryProps {
  userId?: string
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  const { chats, fetchHistory } = useChatStore(state => ({
    chats: state.chats,
    fetchHistory: state.fetchHistory
  }))

  useEffect(() => {
    if (chats.length === 0) {
      fetchHistory()
    }
  }, [fetchHistory, chats.length])

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
        {/* @ts-ignore */}
        <SidebarList userId={userId} chats={chats} />
      </React.Suspense>
    </div>
  )
}
