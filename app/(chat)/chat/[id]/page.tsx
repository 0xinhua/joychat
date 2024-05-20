import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Mixpanel from 'mixpanel'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    notFound()
  }

  if (chat?.user_id !== session?.user?.id) {
    notFound()
  }

  const mixpanel = Mixpanel.init('aa4a031ffe173cb6eeb91bac9aa81f19', { debug: true })

  mixpanel.people.set(session?.user.id, {
    $name: session.user.name,
    $email: session.user.email
  })

  mixpanel.track('Chat Page', {
    distinct_id: session?.user.id
  })

  return <Chat id={chat.chat_id} initialMessages={chat.messages} />
}
