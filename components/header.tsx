import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconChatBot,
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { ChatHistory } from './chat-history'

async function UserOrLogin() {
  const session = await auth()
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
        </>
      ) : (
        <Link href="/" target="_blank" rel="nofollow">
          <IconChatBot className='mt-0.5 mr-1 size-6' />
        </Link>
      )}
    </>
  )
}

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-1 flex items-center justify-between w-full h-16 px-5 shrink-0 dark:bg-zinc-900">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
      {session?.user ? (
          <div className="md:hidden block">
            <UserMenu user={session.user} />
          </div>
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
