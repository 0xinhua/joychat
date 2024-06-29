import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import useUserSettingStore from '@/store/useSettingStore'
import { LoginButton, LoginGoogleButton } from "./login-button"
import { IconChrome, IconCloud } from "./ui/icons"
import { useState } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { useMode } from "./mode"
import { Separator } from "./ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function LoginDialog() {

  const { mode, setMode } = useMode()
  const { isLoginDialogOpen, setLoginDialogOpen } = useUserSettingStore()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'openai_api_key',
    null
  )
  const { toast } = useToast()

  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen}>

    <DialogContent className="sm:max-w-[700px] grid gap-4 bg-background text-foreground md:grid-cols-[1fr,2px,1fr] grid-cols-1">
      <div className="bg-muted dark:bg-gray-800 p-6 flex flex-col gap-4 md:col-span-1">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <IconChrome className="w-6 h-6" />
            Local Mode
          </h3>
          <p className="text-muted-foreground">Your key and data will remain secure, stored locally in your browser.</p>
        </div>
        <form className="grid gap-4" onSubmit={e => e.preventDefault()}>
          <div className="space-y-1">
            {/* <Label htmlFor="api-key">API Key</Label> */}
            <Input id="api-key" placeholder="Enter your OpenAI API key" className="focus-visible:ring-[#0a8537] h-10" value={previewTokenInput}
              onChange={e => setPreviewTokenInput(e.target.value)}
            />
          </div>
          <Button
            className="bg-[#0a8537] hover:bg-[#0a8537e6] dark:text-white"
            onClick={() => {
              if (previewTokenInput) {
                setPreviewToken(previewTokenInput)
                setLoginDialogOpen(false)
                setMode('local')
              } else {
                toast({
                  title: "Save key failed",
                  description: "Please enter your OpenAI key.",
                })
              }
            }}
          >Save to Start</Button>
        </form>
      </div>
      <Separator orientation="vertical" className="w-[1px] relative mx-auto">
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background px-1 py-1 text-muted-foreground dark:text-gray-100">or</span>
      </Separator>
      <div className="bg-background p-6 flex flex-col gap-4 border-t md:border-t-0 border-muted">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <IconCloud className="w-6 h-6" />
            Cloud Mode
          </h3>
          <p className="text-muted-foreground">Sign in with Google or GitHub account. Your data will be securely stored in cloud.</p>
        </div>
        <div className="grid gap-4">
          <LoginGoogleButton />
          <LoginButton />
        </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}
