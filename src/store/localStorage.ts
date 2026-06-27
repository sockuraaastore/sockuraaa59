export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error('LocalStorage write failed:', e)
    return false
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
