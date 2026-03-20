interface DeleteConfirmProps {
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirm({ onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-[12px] text-black/60 dark:text-white/60">ยืนยันลบ?</span>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-white bg-[#FF3B30] hover:bg-[#FF3B30]/90 disabled:opacity-50 transition-colors"
      >
        {loading ? '…' : 'ใช่'}
      </button>
      <button
        onClick={onCancel}
        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-black/60 dark:text-white/60 bg-black/[0.06] dark:bg-white/[0.08] hover:bg-black/[0.09] transition-colors"
      >
        ยกเลิก
      </button>
    </span>
  )
}
