import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import localforage from 'localforage'
import { Chat } from '@/lib/types'
import { localForage } from '@/lib/localforage'

export interface ChatState {
  chats: Array<Chat>
  setChats: (chats: Array<Chat>) => void
  fetchChats: () => Promise<void>
  removeChats: () => void
  fetchRemoveChats: () => Promise<void>
  chat: Chat | null
  fetchChatById: (id: string) => Promise<void>
  removeChat: (chatId: string) => Promise<void>
  fetchRemoveChat: (chatId: string) => Promise<void>
  reset: () => void
  setChat: (chat: Chat) => void
  chatLoading: boolean
}

const useChatStore = create<ChatState>()(
    persist(
      (set) => {
        return {
          chats: [],
          chat: null,
          chatLoading: true,
          setChat: (chat: Chat) => set({chat}),
          setChats: (chats: Chat[]) => set({ chats }),
          fetchChats: async () => {
            const response = await fetch('/api/chats')
            const { data } = await response.json()
            set({ chats: data })
          },
          fetchChatById: async (chatId: string) => {
            const response = await fetch(`/api/chats/${chatId}`)
            const { data } = await response.json()
            set({ chat: data, chatLoading: false })
          },
          removeChats: async() => {
            set({ chats: [] })
            localForage.remove('chat-history')
          },
          fetchRemoveChats: async() => {
            await fetch(`/api/chats`, {
              method: 'delete'
            })
          },
          removeChat: async (chatId: string) => {
            console.log('removeChatx', chatId)
            set((state) => {
              const updatedChats = state.chats.filter(chat => chat.chat_id !== chatId);
              return {
                chats: updatedChats,
                chat: state.chat && state.chat.chat_id === chatId ? null : state.chat,
              };
            });
          },
          fetchRemoveChat: async (chatId: string) => {
            await fetch(`/api/chats/${chatId}`, {
              method: 'delete'
            })
          },
          reset: () => {
            set({ chats: [] })
            localForage.remove('chat-history')
          }
        }
      },
      {
        name: 'chat-history',
        getStorage: () => localforage,
      }
    ),
)

export default useChatStore