export const STORAGE_KEYS = {
  theme: 'verifica_theme',
  language: 'verifica_language',
  history: 'verifica_history',
  xp: 'verifica_xp',
  stats: 'verifica_stats',
}

export function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
  }
}
