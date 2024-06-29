'use client'

import Image from 'next/image'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconAnonymous, IconExternalLink, IconLSignIn, IconSetting, IconSwitch } from '@/components/ui/icons'
import useChatStore from '@/store/useChatStore'

import {
  Github,
  GithubIcon,
  Keyboard,
  LifeBuoy,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from 'next-themes'
import { SettingsDialog } from './settings'
import useUserSettingStore from '@/store/useSettingStore'
import { useRouter } from 'next/navigation'
import { useMode } from './mode'

export interface UserMenuProps {
  user?: Session['user'] | null
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {

  const { setTheme } = useTheme()
  const router = useRouter()
  const { mode, setMode } = useMode()
  const {
    isLoginDialogOpen,
    setLoginDialogOpen,
    setSettingsDialogOpen,
  } = useUserSettingStore()

  const { reset } = useChatStore(state => ({
    reset: state.reset,
  }))

  return (
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
            <div className="flex items-center cursor-pointer justify-center text-xs font-medium uppercase rounded-full select-none size-7 shrink-0 text-muted-foreground">
              {user?.name ? getUserInitials(user?.name) : <div className="px-8 py-2 cursor-pointer text-gray-600 hover:text-accent-foreground dark:text-gray-200">
                <IconAnonymous className='size-6 stroke-1.5' />
              </div>}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 dark:bg-neutral-900 ml-2">
        { user ? <div><DropdownMenuLabel>
          <div className="text-[15px] font-medium">{user?.name}</div>
          <div className="text-[13px] text-zinc-500 font-normal">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator /></div>
        : null}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer dark:hover:bg-zinc-800" onClick={e => setSettingsDialogOpen(true)}>
            <Settings className="mr-2 size-4" />
            <span>Setting</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="dark:hover:bg-zinc-800">
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="dark:bg-zinc-900">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer dark:hover:bg-zinc-800">
                  <Sun className="mr-2 size-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer dark:hover:bg-zinc-800">
                  <Moon className="mr-2 size-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer dark:hover:bg-zinc-800">
                  <Settings className="mr-2 size-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuItem className="dark:hover:bg-zinc-800">
          <GithubIcon className="mr-2 size-4" />
          <a
            href="https://github.com/0xinhua/joychat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full dark:hover:bg-zinc-800"
          >
            GitHub
            <IconExternalLink className="size-4 ml-auto" />
          </a>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <LifeBuoy className="mr-2 size-4" />
          <span>Support</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        {user ? <DropdownMenuItem onClick={() => {
            signOut({
              callbackUrl: '/'
            }).then(() => {
              setMode('local')
              reset()
            })
            }
          }
            className="cursor-pointer dark:hover:bg-zinc-800"
          >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
       : <DropdownMenuItem onClick={() => {
            setLoginDialogOpen(true)
          }
        }
            className="cursor-pointer dark:hover:bg-zinc-800"
          >
          <IconLSignIn className="mr-2 size-4" />
          <span> Sign in</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

