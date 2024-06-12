"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ExternalLink } from "./external-link"
import useUserSettingStore from "@/store/useSettingStore"
import { useEffect, useState } from "react"
import { defaultSystemPrompt } from "@/lib/const"

const settingFormSchema = z.object({
  systemPrompt: z
    .string()
    .min(2, {
      message: "system prompt must be at least 2 characters.",
    })
})

type SettingsFormValues = z.infer<typeof settingFormSchema>

export function SystemPromptForm() {

  const {
    systemPrompt, 
    updateSystemPrompt
  } = useUserSettingStore()

  const defaultValues: Partial<SettingsFormValues> = {
    systemPrompt: systemPrompt || defaultSystemPrompt,
  }

  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender) {
      form.reset({
        systemPrompt: systemPrompt,
      })
      setIsFirstRender(false)
    }
  }, [systemPrompt])

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const watchedSystemPrompt = form.watch("systemPrompt")

  async function onSubmit(data: SettingsFormValues) {
    console.log('data', data)
    const resp = await updateSystemPrompt(data.systemPrompt)
    toast({
      title: "Succeed",
      description: 'System prompt has been updated.',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Prompt</FormLabel> */}
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="You are a helpful assistant."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-4">
                The system prompt shapes the assistant's behavior, allowing you to modify its personality or provide specific instructions, &nbsp;
                  <ExternalLink href="https://platform.openai.com/docs/guides/text-generation/chat-completions-api">
                  learn more.
              </ExternalLink>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={watchedSystemPrompt === defaultValues.systemPrompt}>Save</Button>
      </form>
    </Form>
  )
}
