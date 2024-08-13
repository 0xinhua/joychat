import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import localforage from 'localforage'
import { defaultCustomPrompts, defaultSystemPrompt } from '@/lib/const'
import { localForage } from '@/lib/localforage'

// 定义错误类型
interface CustomError extends Error {
  message: string;
}

interface CustomPrompt {
  id: string;
  heading: string;
  user_message: string;
  system_prompt: string;
}

// 定义状态类型
interface UserSettingState {
  isSettingsDialogOpen: boolean
  isLoginDialogOpen: boolean
  systemPrompt: string
  fetchLoading: boolean
  systemPromptLoading: boolean
  userPromptLoading: boolean
  customPrompts: CustomPrompt[]
  error: string | null | Error
  setLoginDialogOpen: (isOpen: boolean) => void
  setSettingsDialogOpen: (isOpen: boolean) => void
  fetchPrompt: () => Promise<void>
  getSystemPrompt:  () => Promise<void>
  updateSystemPrompt: (prompt: string) => Promise<void>
  updateCustomPrompt: (prompts: CustomPrompt[]) => Promise<void>
  fetchUpdateSystemPrompt: (prompt: string) => Promise<void>
  fetchUpdateUserPrompt: (customPrompts: CustomPrompt[]) => Promise<void>
}

const useUserSettingStore = create<UserSettingState>()(
  persist(
    (set) => {
      return {
        isLoginDialogOpen: false,
        isSettingsDialogOpen: false,
        systemPrompt: defaultSystemPrompt,
        customPrompts: defaultCustomPrompts,
        fetchLoading: false,
        systemPromptLoading: false,
        userPromptLoading: false,
        error: null,
        setSettingsDialogOpen: (isOpen: boolean) => set({ isSettingsDialogOpen: isOpen }),
        setLoginDialogOpen: (isOpen: boolean) => set({ isLoginDialogOpen: isOpen }),
        getSystemPrompt: async () => {
          const localChatSetting = await localForage.get('user-setting') as { state: UserSettingState } || null
          set({ systemPrompt: localChatSetting?.state?.systemPrompt || defaultSystemPrompt })
        },
        fetchPrompt: async () => {
          set({ fetchLoading: true, error: null })
          try {
            const response = await fetch('/api/user/settings')
            if (!response.ok) {
              throw new Error('Failed to fetch system prompt')
            }
            const json = await response.json()
            console.log('json', json)
            set({
              systemPrompt: json.data?.system_prompt ? json.data.system_prompt : defaultSystemPrompt, 
              customPrompts: json.data?.user_prompts ? json.data.user_prompts : defaultCustomPrompts,
              fetchLoading: false
            })
          } catch (error) {
            const customError = error as CustomError
            set({ error: customError.message, fetchLoading: false })
          }
        },
        updateSystemPrompt: async (prompt: string) => {
          set({ systemPrompt: prompt, systemPromptLoading: false })
        },
        updateCustomPrompt: async (customPrompts: CustomPrompt[]) => {
          set({ customPrompts, userPromptLoading: false })
        },
        async fetchUpdateSystemPrompt(prompt: string) {
          try {
            set({ systemPromptLoading: true })
            const response = await fetch('/api/user/settings', {
              method: 'POST',
              body: JSON.stringify({ prompt }),
            })
            const data = await response.json()
            if (data.code === 0) {
              set({ systemPrompt: prompt })
            }
          } catch (error) {
            const customError = error as CustomError
            set({ error: customError.message })
          } finally {
            set({ systemPromptLoading: false })
          }
        },
        async fetchUpdateUserPrompt(customPrompts: CustomPrompt[]) {
          try {
            set({ userPromptLoading: true })
            const response = await fetch('/api/user/settings', {
              method: 'POST',
              body: JSON.stringify({ customPrompts }),
            })
            const data = await response.json()
            if (data.code === 0) {
              set({ customPrompts })
            }
          } catch (error) {
            const customError = error as CustomError
            set({ error: customError.message })
          } finally {
            set({ userPromptLoading: false })
          }
        }
      }
    },
    {
      name: 'user-setting', // 存储名称
      getStorage: () => localforage,
    }
  ),
)

export default useUserSettingStore