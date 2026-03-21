import { useOverview } from './hooks/useOverview'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { MetricCard } from './components/MetricCard'
import { ChannelChart } from './components/ChannelChart'
import { LoanRangeChart } from './components/LoanRangeChart'
import { MetricCardSkeleton } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'

export function OverviewPage() {
  const { filters } = useUrlFilters({ seminar_id: '' })
  const { data, isLoading } = useOverview(filters.seminar_id)

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#007AFF]/10 text-[#007AFF]">UPCOMING</span>
      case 'ongoing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF9500]/12 text-[#FF9500]">ONGOING</span>
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#34C759]/12 text-[#34C759]">COMPLETED</span>
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/50 dark:bg-white/[0.08] dark:text-white/50">CANCELLED</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Row 1 — Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="ลงทะเบียนทั้งหมด"
              value={data?.total_registrations || 0}
            />
            <MetricCard 
              label="เข้าร่วมจริง" 
              value={data?.attended || 0} 
              delta={`${data?.attendance_rate || 0}% attendance rate`} 
            />
            <MetricCard 
              label="เคยกู้มาก่อน" 
              value={data?.loan_before_pct || 0} 
              valueSuffix="%"
              delta={`${Math.round((data?.total_registrations || 0) * (data?.loan_before_pct || 0) / 100)} จาก ${data?.total_registrations || 0} คน`}
            />
            <MetricCard 
              label="CRM active" 
              value={data?.crm_active || 0} 
              delta={`${data?.crm_overdue || 0} ต้อง follow-up`} 
              deltaClassName="text-[#FF9500]"
            />
          </>
        )}
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[360px]">
          <ChannelChart data={data?.channels} />
        </div>
        <div className="h-[360px]">
          <LoanRangeChart data={data?.loan_ranges} />
        </div>
      </div>

      {/* Row 3 — Seminar table */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-black dark:text-white">Seminar ล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">Seminar ID</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">หลักสูตร</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">วันจัด</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ลงทะเบียน</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">เข้าร่วม</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">Attendance %</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-5 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : (data?.seminars || []).map((seminar) => (
                <tr key={seminar.seminar_id} className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 font-medium">{seminar.seminar_id}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{seminar.course_name}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{formatDate(seminar.event_date)}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">{seminar.total}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">{seminar.attended}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">
                    {seminar.total > 0 ? Math.round((seminar.attended / seminar.total) * 100) : 0}%
                  </td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">
                    {renderStatusBadge(seminar.status)}
                  </td>
                </tr>
              ))}
              {!isLoading && (!data?.seminars || data.seminars.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-black/40 dark:text-white/40">
                    ไม่พบข้อมูล Seminar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
