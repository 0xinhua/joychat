import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { cache } from 'react'
import { auth } from '@/auth'
import { Chat } from '@/lib/types'
import { UserMenu } from './user-menu'
import { Session } from 'next-auth'
import { SettingsDialog } from './settings'

interface SidebarListProps {
  userId?: string,
  session?: Session | null
  chats: Chat[],
  children?: React.ReactNode
}

export function SidebarList({ chats, session }: SidebarListProps) {

  return (
    <div className="flex h-[calc(100vh-3.8rem)] flex-col overflow-hidden">
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
         <div>
          <SettingsDialog />
          <UserMenu user={session?.user} />
        </div>
        <ClearHistory isEnabled={chats?.length > 0} />
      </div>
    </div>
  )
}
