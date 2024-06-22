import { auth } from '@/auth'
import { LoginButton, LoginGoogleButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

import { IconChatBot, IconChatBotDark } from '@/components/ui/icons'
import { ExternalLink } from '@/components/external-link'

export const metadata = {
  title: {
    default: 'JoyChat',
    template: `%s - Your personal AI assistant`
  }
}

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-1 flex justify-center items-center dark:bg-black">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[320px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex text-center items-center justify-center ">
              <IconChatBot className='mr-1.5 mt-1.5 mt-0.5 size-8 dark:hidden' />
              <IconChatBotDark className='mr-1.5 mt-1.5 mt-0.5 size-8 hidden dark:block' />
              <h1 className="text-2xl font-semibold tracking-tight">
              JoyChat
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Create an account to start using JoyChat.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <LoginGoogleButton />
              <LoginButton />
            </div>
          </div>
          <div className="hidden text-muted-foreground text-center text-xs">
            JoyChat is open source on{" "}
            <ExternalLink className="py-1 tracking-wide" title="JoyChat GitHub" href="https://github.com/0xinhua/joychat">
              GitHub
            </ExternalLink>
          </div>
        </div>
      </div>
  </div>
  )
}

