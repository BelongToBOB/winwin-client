import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(new Date(iso))
}

export function formatNum(n: number) {
  if (n === null || n === undefined) return '0'
  return new Intl.NumberFormat('th-TH').format(n)
}

export function isOverdue(dateStr: string) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
}
