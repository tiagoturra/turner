type StorageArea = 'local' | 'session'

function getStorage(area: StorageArea) {
  if (typeof window === 'undefined') return null
  return area === 'local' ? window.localStorage : window.sessionStorage
}

export function readStorage<T>(key: string, area: StorageArea = 'local'): T | null {
  const value = getStorage(area)?.getItem(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function writeStorage<T>(key: string, value: T, area: StorageArea = 'local') {
  getStorage(area)?.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string, area: StorageArea = 'local') {
  getStorage(area)?.removeItem(key)
}
