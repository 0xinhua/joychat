'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconGoogle, IconSpinner } from '@/components/ui/icons'
import { useMode } from './mode'
import useUserSettingStore from '@/store/useSettingStore'

interface LoginButtonProps extends ButtonProps {
  showIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Sign in with GitHub',
  showIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { mode, setMode } = useMode()
  const { isLoginDialogOpen, setLoginDialogOpen } = useUserSettingStore()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        setIsLoading(true)
        setMode('cloud')
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: `/` })
        setLoginDialogOpen(false)
      }}
      disabled={isLoading}
      className={cn('shadow-none py-5 dark:border-gray-500', className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      { text }
    </Button>
  )
}

export function LoginGoogleButton({
  text = 'Sign in with Google',
  showIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { setLoginDialogOpen } = useUserSettingStore()
  const { mode, setMode } = useMode()
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        setMode('cloud')
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('google', { callbackUrl: `/`, redirect: true })
        setLoginDialogOpen(false)
      }}
      disabled={isLoading}
      className={cn('shadow-none py-5 dark:border-gray-500', className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconGoogle className="mr-2" />
      ) : null}
      { text }
    </Button>
  )
}