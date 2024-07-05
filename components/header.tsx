'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconChatBot,
  IconGitHub,
  IconSignIn,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { ChatHistory } from './chat-history'
import useUserSettingStore from '@/store/useSettingStore'
import { useSession } from 'next-auth/react'

export function Header() {
  const { data: session, status } = useSession()
  const {
    isLoginDialogOpen,
    setLoginDialogOpen,
  } = useUserSettingStore()
  return (
    <header className="sticky top-0 z-1 flex items-center justify-between w-full h-16 px-4 lg:px-5 shrink-0 dark:bg-zinc-900">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <>
          <SidebarMobile>
            <ChatHistory userId={session?.user?.id} session={session} />
          </SidebarMobile>
        </>
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
      {session?.user ? (
          <div className="md:hidden block">
            <UserMenu user={session.user} />
          </div>
        ) : (
          <div className="-ml-2 block md:hidden" onClick={() => setLoginDialogOpen(true)}>
            { !isLoginDialogOpen ? <IconSignIn className="mr-2 size-5" /> : null }
          </div>
        )}
      </div>
    </header>
  )
}
