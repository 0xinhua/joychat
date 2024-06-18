import localforage from "localforage"

class LocalForage {

  async get<T>(key: string): Promise<T | null> {
    try {
      const val = await localforage.getItem(key) as string
      return JSON.parse(val)
    } catch (error) {
      console.error(error)
      return null
    }
  }
  
  async set<T>(key: string, val: T) {
    try {
      return await localforage.setItem(key, JSON.stringify(val))
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async remove(key: string, isPrefixMode = true) {
    try {
      if (isPrefixMode) {
        const toRemove: string[] = []
        await localforage.iterate((value, _key) => {
          if (_key.startsWith(key)) {
            toRemove.push(_key)
          }
        })
        await Promise.all(toRemove.map(item => localforage.removeItem(item)))
      } else {
        await localforage.removeItem(key)
      }
    } catch (error) {
      console.error(error)
    }
  }

  clear() {
    localforage.clear()
  }
}

export const localForage = new LocalForage()