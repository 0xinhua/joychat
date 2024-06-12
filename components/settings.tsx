import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import useUserSettingStore from '@/store/useSettingStore'
import { Separator } from "./ui/separator"
import { SettingsSidebarNav } from "./settings-sidebar-nav"
import { SystemPromptForm } from "./system-prompt"

const sidebarNavItems = [
  {
    title: "Account",
    href: "/examples/forms/account",
  },
  {
    title: "Display",
    href: "/examples/forms/display",
  },
]


export function SettingsDialog() {
  const { isSettingsDialogOpen, setSettingsDialogOpen } = useUserSettingStore()
  return (
    <Dialog open={isSettingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">settings</Button> */}
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-[625px] w-full'
        onEscapeKeyDown={(e) => e.preventDefault()}
        // onPointerDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        // onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="space-y-6 sm:p-10 p-6 sm:pb-16 pb-10">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Setting</h2>
            <p className="text-muted-foreground">
              Customize and save your system prompt.
            </p>
          </div>
          {/* <Separator className="my-6" /> */}
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            {/* <aside className="-mx-4 lg:w-1/5">
              <SettingsSidebarNav items={sidebarNavItems} />
            </aside> */}
            {/* <div className="flex-1 lg:max-w-2xl">{children}</div> */}
            <SystemPromptForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
