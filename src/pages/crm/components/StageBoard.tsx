import { cn, formatNum } from '@/lib/utils'
import type { CrmStage, CrmStageValue } from '@/types/crm'

interface StageBoardProps {
  stages?: CrmStage[]
  isLoading?: boolean
}

const STAGE_ORDER: CrmStageValue[] = ['new', 'contacted', 'interested', 'proposal', 'closed_won', 'closed_lost']

const STAGE_CONFIG: Record<string, { label: string; colorClass: string }> = {
  new: { label: 'ใหม่', colorClass: 'text-[#007AFF]' },
  contacted: { label: 'ติดต่อแล้ว', colorClass: 'text-[#FF9500]' },
  interested: { label: 'สนใจ', colorClass: 'text-[#AF52DE]' },
  proposal: { label: 'เสนอราคา', colorClass: 'text-[#34C759]' },
  closed_won: { label: 'ปิดการขายได้', colorClass: 'text-[#34C759] font-semibold' },
  closed_lost: { label: 'ปิดการขายไม่ได้', colorClass: 'text-[#FF3B30]' },
}

export function StageBoard({ stages = [], isLoading }: StageBoardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-4 flex flex-col gap-1">
             <div className="animate-pulse h-4 w-16 bg-black/[0.06] dark:bg-white/[0.08] rounded" />
             <div className="animate-pulse h-8 w-12 bg-black/[0.06] dark:bg-white/[0.08] rounded mt-1" />
          </div>
        ))}
      </div>
    )
  }

  const normalizedStages = STAGE_ORDER.map(stageKey => {
    const found = stages.find(s => s.stage === stageKey)
    return {
      key: stageKey,
      count: found ? found.count : 0,
      config: STAGE_CONFIG[stageKey]
    }
  })

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
      {normalizedStages.map(({ key, count, config }) => (
        <div key={key} className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-4 flex flex-col gap-1">
          <div className="text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">
            {config.label}
          </div>
          <div className={cn('text-[28px] tracking-tight tabular-nums', config.colorClass)}>
            {formatNum(count)}
          </div>
        </div>
      ))}
    </div>
  )
}
