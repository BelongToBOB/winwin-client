interface FormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[12px] text-[#FF3B30]">{error}</span>
      )}
    </div>
  )
}
