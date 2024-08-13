"use client"

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
} from "@/components/ui/form"
import { defaultPromptsHeading, defaultSystemPrompt } from "@/lib/const"
import { useState } from "react"
import { IconPencil, IconPlus, IconTrash } from "@/components/ui/icons"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CustomPromptForm } from "@/components/custom-prompt-form"
import useUserSettingStore from "@/store/useSettingStore"
import { useMode } from "@/components/mode"
import { generateUUID } from "@/lib/utils"

const customPromptsSchema = z.object({
  id: z.string(),
  heading: z.string().min(1, "Title is required"),
  system_prompt: z.string(),
  user_message: z.string().min(1, "Message is required"),
});

export type CustomPromptTemplate = z.infer<typeof customPromptsSchema>

export function QuickstartPromptForm() {

  const {
    updateCustomPrompt,
    customPrompts,
    fetchUpdateUserPrompt
  } = useUserSettingStore()

  const { mode } = useMode()

  const [editingPrompt, setEditingPrompt] = useState<CustomPromptTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState('');

  const form = useForm()

  const handleCreate = (id: string) => {
    console.log('create id', id)
    const randomIndex = Math.floor(Math.random() * defaultPromptsHeading.length);
    const prompt = {
      id,
      heading: defaultPromptsHeading[randomIndex],
      system_prompt: defaultSystemPrompt,
      user_message: ''
    }
    setEditingPrompt(prompt);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const prompt = customPrompts.find(pmt => pmt.id === id) as CustomPromptTemplate
    setEditingPrompt(prompt);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteDialogOpen(true)
    setDeletePromptId(id);
  };

  const onSubmitDelete = async (id: string) => {
    const updatedCustomPrompts = customPrompts.filter((_, i) => _.id !== id) as CustomPromptTemplate [];
    updateCustomPrompt(updatedCustomPrompts);
    if (mode === 'cloud') {
      await fetchUpdateUserPrompt(updatedCustomPrompts);
    }
    setDeleteDialogOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium">User prompt</h3>
          <p className="text-sm text-muted-foreground mb-6">
            You can configure prompts based on your own commonly used conversation scenarios.
          </p>
        </div>
        <div className="space-y-4">
          {customPrompts?.map((customPrompt, index) => (
            <FormField
              key={index} 
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {customPrompt.heading}
                    </FormLabel>
                    <FormDescription className="max-h-32 overflow-hidden line-clamp-3">
                      {customPrompt.user_message}
                    </FormDescription>
                  </div>
                  <FormControl>
                  <div className="space-x-3 flex ">
                    <Button variant="ghost" className="flex gap-x-2" onClick={() => handleEdit(customPrompt.id)}><IconPencil className="size-4" /></Button>
                    <Button variant="outline" className="flex gap-x-2 shadow-none" onClick={() => handleDelete(customPrompt.id)}><IconTrash className="size-4" /></Button>
                  </div>
                  </FormControl>
                </FormItem>
              )}
            />
            ))
          }
        </div>
        <Button onClick={() => handleCreate(generateUUID())}><IconPlus className="mr-1" /> Add new prompt</Button>
      </form>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-y-2">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmitDelete(deletePromptId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className='sm:max-w-[625px] w-full'
          onEscapeKeyDown={(e) => e.preventDefault()}
          // onPointerDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="sm:p-6 sm:pb-10 pb-10">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">Prompt</h2>
              <p className="text-muted-foreground">
                Customize and save your quickstart prompts template.
              </p>
            </div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <CustomPromptForm prompt={editingPrompt} onSubmitCallback={() => setDialogOpen(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  )
}
