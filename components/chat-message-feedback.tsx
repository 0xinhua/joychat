import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Message } from 'ai'
import { IconThumbsDown, IconThumbsUp } from './ui/icons'
import { Feedback } from '@/lib/types'
import { langfuseBrowser } from '@/lib/langfuse'
import { DialogDescription } from '@radix-ui/react-dialog'

export function ChatMessageFeedback({ message }: { message: Message }) {

  const [currentFeedback, setCurrentFeedback] = useState<
  Feedback | "submitting" | null
  >(null)

  const [modalState, setModalState] = useState<{
    feedback: Feedback
    comment: string
  } | null>(null)

  const handleSubmitFeedback = () => {

    if (!langfuseBrowser) return
    if (currentFeedback === "submitting" || !modalState) return

    setCurrentFeedback("submitting")

    langfuseBrowser
      .score({
        traceId: message.id,
        name: "user-feedback",
        value: modalState.feedback === "positive" ? 1 : 0,
        comment: modalState.comment !== "" ? modalState.comment : undefined,
      })
      .then(() => {
        setCurrentFeedback(modalState.feedback)
      })
      .catch((err) => {
        console.error(err)
        setCurrentFeedback(null)
      })

      setModalState(null)
  }

  return (
    <div className="flex flex-col items-center dark:bg-transparent rounded-lg">
      <div className="flex">
        <Button
          onClick={() =>
            setModalState({
              feedback: "positive",
              comment: "",
            })
          }
          variant="outline"
          className="flex border-none dark:bg-transparent shadow-none items-center px-1 hover:bg-transparent"
        >
          <IconThumbsUp className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>
        <Button
          onClick={() =>
            setModalState({
              feedback: "negative",
              comment: "",
            })
          }
          variant="outline"
          className="flex border-none shadow-none dark:bg-transparent items-center px-1 hover:bg-transparent"
        >
          <IconThumbsDown className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>
      </div>

      <Dialog open={!!modalState} onOpenChange={handleSubmitFeedback}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-left">Feedback</DialogTitle>
          </DialogHeader>
          <DialogDescription>Please provide details: (optional)</DialogDescription>
          <Textarea
            placeholder="What was satisfying or not helpful about this response?"
            value={modalState?.comment ?? ""}
            onChange={(e) => {
              setModalState({ ...modalState!, comment: e.target.value });
            }}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button className="sm:h-10 h-10" onClick={handleSubmitFeedback}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
