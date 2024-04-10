import { auth } from '@/auth'
import { LoginButton, LoginGoogleButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="flex flex-col gap-y-4 h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LoginGoogleButton />
      <LoginButton />
    </div>
  )
}
