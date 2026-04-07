import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return createPortal(
    <div
      style={{ visibility: open ? 'visible' : 'hidden' }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.2)' }}
        onClick={onClose}
      />
      <div
        className={`relative w-full sm:w-[480px] h-full bg-white dark:bg-[#1C1C1E] flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4
          border-b border-black/[0.08] dark:border-white/[0.08]">
          <span className="text-[15px] font-semibold text-black dark:text-white">
            {title}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center
              text-black/40 dark:text-white/40
              hover:bg-black/[0.06] dark:hover:bg-white/[0.08]
              transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
