'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconGoogle, IconSpinner } from '@/components/ui/icons'

interface LoginButtonProps extends ButtonProps {
  showIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Login with GitHub',
  showIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: `/` })
      }}
      disabled={isLoading}
      className={cn('shadow-none', className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}

export function LoginGoogleButton({
  text = 'Login with Google',
  showIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('google', { callbackUrl: `/` })
      }}
      disabled={isLoading}
      className={cn('shadow-none', className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconGoogle className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}