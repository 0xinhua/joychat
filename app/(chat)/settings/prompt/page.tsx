"use client"

import { Separator } from "@/components/ui/separator"
import { QuickstartPromptForm } from "./prompt-form"
import { SystemPromptForm } from "@/components/system-prompt"
import { useMode } from "@/components/mode"
import useUserSettingStore from "@/store/useSettingStore"
import { useEffect } from "react"

export default function SettingsPersonalization() {

  const { mode } = useMode()
  const {
    fetchPrompt,
  } = useUserSettingStore()

  useEffect(() => {
    mode === 'cloud' && fetchPrompt()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Prompt</h3>
        <p className="text-sm text-muted-foreground">
          Configure system prompt and quickstart user prompts.
        </p>
      </div>
      <Separator />
      <SystemPromptForm />
      <Separator />
      <QuickstartPromptForm />
    </div>
  )
}
