import { Header } from '@/components/header'
import { SidebarDesktop } from '@/components/sidebar-desktop'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-[calc(100vh)] overflow-hidden">
      <SidebarDesktop />
      <div className="w-full dark:bg-zinc-900 overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[240px] peer-[[data-state=open]]:xl:pl-[256px]">
        <Header />
        {children}
      </div>
    </div>
  )
}
