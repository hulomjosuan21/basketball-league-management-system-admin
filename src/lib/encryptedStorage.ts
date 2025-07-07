import CryptoJS from 'crypto-js'
import type { PersistStorage, StorageValue } from 'zustand/middleware'

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'dev-secret'

export const encryptedStorage: PersistStorage<any> = {
  getItem: (name) => {
    try {
      const encrypted = localStorage.getItem(name)
      if (!encrypted) return null

      const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('[Storage] Failed to decrypt:', error)
      return null
    }
  },

  setItem: (name, value) => {
    try {
      const serialized = JSON.stringify(value)
      const encrypted = CryptoJS.AES.encrypt(serialized, SECRET_KEY).toString()
      localStorage.setItem(name, encrypted)
    } catch (error) {
      console.error('[Storage] Failed to encrypt:', error)
    }
  },

  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}
