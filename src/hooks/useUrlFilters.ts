import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

export function useUrlFilters<T extends Record<string, string>>(defaults: T) {
  const [params, setParams] = useSearchParams()

  const filters = Object.fromEntries(
    Object.keys(defaults).map((k) => [k, params.get(k) ?? defaults[k]])
  ) as T

  const setFilter = useCallback(
    (key: string, value: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        value ? next.set(key, value) : next.delete(key)
        return next
      }, { replace: true })
    },
    [setParams]
  )

  return { filters, setFilter }
}
