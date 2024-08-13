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
import { defaultSystemPrompt } from "@/lib/const"
import { Input } from "./ui/input"
import { CustomPromptTemplate } from "@/app/(chat)/settings/prompt/prompt-form"
import { nanoid } from "nanoid"
import { useMode } from "./mode"
import { IconLoaderCircle } from "./ui/icons"

const settingFormSchema = z.object({
  id: z.string(),
  heading: z
  .string().min(2, { message: "Prompt name must be at least 2 characters.", })
  .max(100, { message: "Prompt name must be at most 100 characters." }),
  system_prompt: z
    .string()
    .min(2, { message: "System prompt must be at least 2 characters.", })
    .max(1000, { message: "System prompt must be at most 1000 characters." })
  , user_message: z.string()
    .min(2, { message: "User prompt must be at least 2 characters.", })
    .max(2000, { message: "User prompt must be at most 2000 characters." })
  })

type SettingsFormValues = z.infer<typeof settingFormSchema>

export function CustomPromptForm({ prompt, onSubmitCallback } : { prompt: CustomPromptTemplate | null, onSubmitCallback: () => void }) {

  const {
    customPrompts,
    userPromptLoading,
    updateCustomPrompt,
    fetchUpdateUserPrompt
  } = useUserSettingStore()

  const { mode } = useMode()

  const defaultValues: Partial<SettingsFormValues> = {
    id: prompt?.id || nanoid(),
    system_prompt: prompt?.system_prompt || defaultSystemPrompt,
    heading: prompt?.heading,
    user_message: prompt?.user_message
  }

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const watchedSystemPrompt = form.watch("system_prompt")
  const watchedUsePrompt = form.watch("user_message")
  const watchHeading = form.watch("heading")

  async function onSubmit(data: SettingsFormValues) {
    console.log('data', data)

    const updatedPrompt: CustomPromptTemplate = {
      id: data.id,
      heading: data.heading,
      system_prompt: data.system_prompt,
      user_message: data.user_message
    }

    const updatedCustomPrompts = customPrompts.map(p => 
      p.id === updatedPrompt.id ? updatedPrompt : p
    )

    if (!updatedCustomPrompts.some(p => p.id === updatedPrompt.id)) {
      updatedCustomPrompts.push(updatedPrompt)
    }

    try {

      await updateCustomPrompt(updatedCustomPrompts)

      if (mode === 'cloud') {
        await fetchUpdateUserPrompt(updatedCustomPrompts)
      }
      
      toast({
        title: "Success",
        description: 'Custom prompt has been updated.',
      })

      if (onSubmitCallback) {
        onSubmitCallback()
      }

    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to update custom prompt.',
        variant: "destructive"
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  readOnly
                  placeholder="Name of this prompt"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of this prompt"
                  {...field}
                />
              </FormControl>
              <FormDescription>
               Give a short name of your prompt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="system_prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are a helpful assistant."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-4">
                Set a system prompt, it shapes the assistant behavior, &nbsp;
                  <ExternalLink href="https://platform.openai.com/docs/guides/text-generation/chat-completions-api">
                  learn more.
              </ExternalLink>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user_message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Prompt</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Enter instructions or prompt here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The user prompt message will also be pre-filled message in chat box.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={watchedSystemPrompt === defaultValues.system_prompt
          && watchedUsePrompt === defaultValues.user_message
          && watchHeading === defaultValues.heading}>
          { userPromptLoading && <IconLoaderCircle className="size-4 mr-1 animate-spin" />}
          Save</Button>
      </form>
    </Form>
  )
}
