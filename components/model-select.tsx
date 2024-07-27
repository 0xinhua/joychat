'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { defaultModel, availableModels } from '@/lib/const'

export function ModelSelect() {

  const [model, setModel] = useLocalStorage('selected-model', defaultModel)

  return (
    <div className="col-span-1 mt-3 md:col-span-2 flex flex-col gap-y-1 leading-normal text-muted-foreground sm:pb-0 pb-4">
      <h1 className="mb-2 text-lg font-semibold text-foreground">✨ Model</h1>
      <Select defaultValue={model} onValueChange={setModel}>
        <SelectTrigger className="w-[154px] shadow-none dark:border-[#3e3e3e] dark:text-zinc-300">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="dark:bg-zinc-900">
          <SelectGroup>
            { availableModels.map((model) => (
              <SelectItem key={model.value} value={model.value} className={model.disabled ? 'cursor-not-allowed' : 'cursor-pointer dark:hover:bg-zinc-800'} disabled={model.disabled}>
                <div className="flex items-center justify-center gap-x-1.5">
                  {<model.icon />}
                  <span className="line-clamp-1">{ model.label}</span>
                </div>
              </SelectItem>
            )) }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
