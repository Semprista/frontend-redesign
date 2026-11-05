import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue

    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : (JSON.parse(stored) as T)
    } catch (error) {
      console.warn(`Impossible de lire la donnée locale « ${key} ».`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Impossible d'enregistrer la donnée locale « ${key} ».`, error)
    }
  }, [key, value])

  return [value, setValue] as const
}
