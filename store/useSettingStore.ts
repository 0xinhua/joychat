import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import localforage from 'localforage'
import { defaultSystemPrompt } from '@/lib/const'
import { localForage } from '@/lib/localforage'

// 定义错误类型
interface CustomError extends Error {
  message: string;
}

// 定义状态类型
interface UserSettingState {
  isSettingsDialogOpen: boolean
  isLoginDialogOpen: boolean
  systemPrompt: string
  loading: boolean
  error: string | null | Error
  setLoginDialogOpen: (isOpen: boolean) => void
  setSettingsDialogOpen: (isOpen: boolean) => void
  fetchSystemPrompt: () => Promise<void>
  getSystemPrompt:  () => Promise<void>
  updateSystemPrompt: (prompt: string) => Promise<void>
  fetchUpdatePrompt: (prompt: string) => Promise<void>
}

const useUserSettingStore = create<UserSettingState>()(
  persist(
    (set, get) => {
      return {
        isLoginDialogOpen: false,
        isSettingsDialogOpen: false,
        systemPrompt: defaultSystemPrompt,
        loading: false,
        error: null,
        setSettingsDialogOpen: (isOpen: boolean) => set({ isSettingsDialogOpen: isOpen }),
        setLoginDialogOpen: (isOpen: boolean) => set({ isLoginDialogOpen: isOpen }),
        getSystemPrompt: async () => {
          const localChatSetting = await localForage.get('user-setting') as { state: UserSettingState } || null
          set({ systemPrompt: localChatSetting?.state?.systemPrompt || defaultSystemPrompt })
        },
        fetchSystemPrompt: async () => {
          set({ loading: true, error: null })
          try {
            const response = await fetch('/api/user/settings/systemPrompt')
            if (!response.ok) {
              throw new Error('Failed to fetch system prompt')
            }
            const json = await response.json()
            set({
              systemPrompt: json.data?.prompt ? json.data.prompt : defaultSystemPrompt, 
              loading: false
            })
          } catch (error) {
            const customError = error as CustomError
            set({ error: customError.message, loading: false })
          }
        },
        updateSystemPrompt: async (prompt: string) => {
          set({ systemPrompt: prompt, loading: false })
        },
        async fetchUpdatePrompt(prompt: string) {

          try {
            set({loading: true})
            const response = await fetch('/api/user/settings/systemPrompt', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt }),
            })
            if (!response.ok) {
              throw new Error('Failed to update system prompt')
            }
            const data = await response.json()
            set({ loading: false })
            if (data.code === 0) {
              set({ systemPrompt: prompt, loading: false })
            } else {
              throw new Error(data.message || 'Unknown error')
            }
          } catch (error) {
            set({ loading: false })
            const customError = error as CustomError
            set({ error: customError.message, loading: false })
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