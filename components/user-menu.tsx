'use client'

import Image from 'next/image'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconExternalLink } from '@/components/ui/icons'
import useChatStore from '@/store/useChatStore'
import { ThemeToggle } from './theme-toggle'

export interface UserMenuProps {
  user: Session['user']
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {

  const { reset } = useChatStore(state => ({
    reset: state.reset,
  }))

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="pl-0 flex cursor-pointer">
            {user?.image ? (
              <Image
                className="size-7 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
                src={user?.image ? `${user.image}` : ''}
                alt={user.name ?? 'Avatar'}
                height={48}
                width={48}
                unoptimized={true}
              />
            ) : (
              <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none size-7 shrink-0 bg-muted/50 text-muted-foreground">
                {user?.name ? getUserInitials(user?.name) : null}
              </div>
            )}
            {/* <span className="ml-2">{user?.name}</span> */}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem className="cursor-pointer">
            <div className="text-xs font-medium cursor-pointer">Settings</div>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href="https://github.com/0xinhua/joychat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full text-xs"
            >
              GitHub
              <IconExternalLink className="size-3 ml-auto" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
                signOut({
                  callbackUrl: '/'
                }).then(() => {
                  reset()
                })
              }
            }
            className="text-xs cursor-pointer"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
