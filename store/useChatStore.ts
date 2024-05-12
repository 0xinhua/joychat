import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import localforage from 'localforage'
import { Chat } from '@/lib/types'

// 定义状态类型
export interface ChatState {
  chats: Array<Chat>
  setChats: (chats: Array<Chat>) => void
  fetchHistory: () => Promise<void>
  deleteChat: (id: string) => void
  removeChats: () => void
}

const useChatStore = create<ChatState>()(
    persist(
      //@ts-ignore
      (set) => ({
        chats: [],
        setChats: (chats: Chat[]) => set({ chats }),
        fetchHistory: async () => {
          const response = await fetch('/api/history')
          const { data } = await response.json()
          set({ chats: data })
        },
        deleteChat: (id: string) => set((state) => ({
          chats: state.chats.filter(chat => chat.id !== id)
        })),
        removeChats: () => {
          set({ chats: [] })
          localforage.removeItem('chat-history')
        }
      }),
      {
        name: 'chat-history',
        getStorage: () => localforage,
      }
    ),
)

export default useChatStore