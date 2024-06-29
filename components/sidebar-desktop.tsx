import { Sidebar } from '@/components/sidebar'

import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat-history'
import { IconChatBot, IconChatBotDark, IconSquarePen } from './ui/icons'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserMenu } from './user-menu'

export async function SidebarDesktop() {
  const session = await auth() || null

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[240px] xl:w-[256px]">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'flex w-full h-fit px-3 mt-2 border-none justify-start font-normal shadow-none transition-colors text-gray-600 max-xl:text-sm hover:bg-transparent'
        )}
        >
        <div className="flex h-10 rounded-md px-2 py-4 w-full items-center justify-between font-medium hover:bg-zinc-200 dark:border-gray-800 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700">
          <div className="flex items-center">
            <IconChatBot className='mr-1 mt-0.5 size-6 dark:hidden' />
            <IconChatBotDark className='mr-1.5 mt-0.5 size-6 hidden dark:block' />
            JoyChat
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div> <IconSquarePen className="-translate-x-1 stroke-1.5 size-5" /></div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="z-2">New Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Link>
      <ChatHistory userId={session?.user?.id} session={session} />
    </Sidebar>
  )
}
