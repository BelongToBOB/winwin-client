import { useEffect, useState } from 'react'
import { cn, formatNum } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: number
  valuePrefix?: string
  valueSuffix?: string
  delta?: React.ReactNode
  deltaClassName?: string
}

export function MetricCard({ label, value, valuePrefix = '', valueSuffix = '', delta, deltaClassName }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const duration = 800

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3) 
      setDisplayValue(Math.floor(easeOut * value))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setDisplayValue(value)
      }
    }

    window.requestAnimationFrame(step)
  }, [value])

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-5 flex flex-col gap-1.5 transition-all duration-200">
      <div className="text-[15px] font-semibold text-black/60 dark:text-white/60">
        {label}
      </div>
      <div className="text-[28px] font-semibold tracking-tight tabular-nums text-black dark:text-white mt-1">
        {valuePrefix}{formatNum(displayValue)}{valueSuffix}
      </div>
      {delta && (
        <div className={cn('text-[13px] text-black/60 dark:text-white/60', deltaClassName)}>
          {delta}
        </div>
      )}
    </div>
  )
}
