import { isOverdue, formatDate } from '@/lib/utils'
import type { Followup } from '@/types/crm'

interface FollowupTableProps {
  data?: Followup[]
  isLoading?: boolean
  overdueOnly: boolean
  onToggleOverdue: (val: boolean) => void
  onRowClick: (followup: Followup) => void
}

export function FollowupTable({ data = [], isLoading, overdueOnly, onToggleOverdue, onRowClick }: FollowupTableProps) {
  const overdueCount = data.filter(d => isOverdue(d.next_followup)).length

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-semibold text-black dark:text-white">รายการที่ต้องติดตาม</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF3B30]/10 text-[#FF3B30]">
            {overdueCount} เกินกำหนด
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="overdue-toggle" className="text-[13px] text-black/60 dark:text-white/60 cursor-pointer">เฉพาะที่เกินกำหนด</label>
          <input
            id="overdue-toggle"
            type="checkbox"
            role="switch"
            checked={overdueOnly}
            onChange={(e) => onToggleOverdue(e.target.checked)}
            className="w-[44px] h-[26px] rounded-full cursor-pointer appearance-none bg-black/20 dark:bg-white/20 checked:bg-[#34C759] transition-colors duration-200 relative before:content-[''] before:absolute before:w-[22px] before:h-[22px] before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:translate-x-[18px] before:transition-transform before:shadow-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ–นามสกุล</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ผู้ดูแล</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ติดต่อล่าสุด</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ติดตามครั้งต่อไป</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ช่องทาง</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-10 rounded-xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : data.map((row) => {
              const overdue = isOverdue(row.next_followup)
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className={`border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 cursor-pointer transition-colors duration-150 ${
                    overdue
                      ? 'bg-[#FF3B30]/[0.04] dark:bg-[#FF3B30]/[0.08] hover:bg-[#FF3B30]/[0.06] dark:hover:bg-[#FF3B30]/[0.1]'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-black/80 dark:text-white/80">{row.first_name} {row.last_name}</td>
                  <td className="px-4 py-3">{renderStageBadge(row.crm_stage)}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{row.assigned_to}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">{formatDate(row.last_contacted)}</td>
                  <td className={`px-4 py-3 tabular-nums ${overdue ? 'text-[#FF3B30] font-medium' : 'text-black/80 dark:text-white/80'}`}>
                    {formatDate(row.next_followup)}
                  </td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{row.channel}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 max-w-[200px] truncate">{row.notes}</td>
                </tr>
              )
            })}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                  ไม่มีรายการที่ต้องติดตาม
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function renderStageBadge(stage: string) {
  switch (stage) {
    case 'new': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#007AFF]/10 text-[#007AFF]">ใหม่</span>
    case 'contacted': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF9500]/12 text-[#FF9500]">ติดต่อแล้ว</span>
    case 'interested': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#AF52DE]/10 text-[#AF52DE]">สนใจ</span>
    case 'proposal': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#34C759]/12 text-[#34C759]">เสนอราคา</span>
    case 'closed_won': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#34C759]/16 text-[#34C759] font-semibold">ปิดการขายได้</span>
    case 'closed_lost': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF3B30]/10 text-[#FF3B30]">ปิดการขายไม่ได้</span>
    default: return null
  }
}
