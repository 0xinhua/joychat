import { clearChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { cache } from 'react'
import { auth } from '@/auth'
import { Chat } from '@/lib/types'
import { UserMenu } from './user-menu'
import { Session } from 'next-auth'

interface SidebarListProps {
  userId?: string,
  session?: Session
  chats: Chat[],
  children?: React.ReactNode
}

export function SidebarFooter({ chats, session }: SidebarListProps) {

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-1 px-3">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between py-4 px-3 sm:pl-4">
        {session?.user ? <UserMenu user={session.user} /> : null}
        <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
      </div>
    </div>
  )
}
