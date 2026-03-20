import { useState } from 'react'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useRegistrations } from './hooks/useRegistrations'
import { FilterBar } from './components/FilterBar'
import { RegistrantDrawer } from './components/RegistrantDrawer'
import { formatDate } from '@/lib/utils'
import type { Registration } from '@/types/registration'

export function RegistrationsPage() {
  const { filters, setFilter } = useUrlFilters({ seminar_id: '', status: '', job: '', loan_range: '', q: '' })
  const { data, isLoading } = useRegistrations(filters)
  
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const isDrawerOpen = !!selectedReg

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/50 dark:bg-white/[0.08] dark:text-white/50">PENDING</span>
      case 'confirmed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#007AFF]/10 text-[#007AFF]">CONFIRMED</span>
      case 'attended': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#34C759]/12 text-[#34C759]">ATTENDED</span>
      case 'no_show': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF3B30]/10 text-[#FF3B30]">NO SHOW</span>
      case 'cancelled': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/30 dark:bg-white/[0.06] dark:text-white/30">CANCELLED</span>
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <FilterBar filters={filters} setFilter={setFilter} />

      <div className="flex justify-end text-xs text-black/40 dark:text-white/40 mb-2">
        {data?.length || 0} รายการ
      </div>

      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ–นามสกุล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อเล่น</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">อาชีพ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">Channel</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">Loan range</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">เคยกู้</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">วันลงทะเบียน</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={8} className="px-4 py-3">
                      <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-10 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : (data || []).map((reg) => (
                <tr 
                  key={reg.id} 
                  onClick={() => setSelectedReg(reg)}
                  className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 font-medium">{reg.first_name} {reg.last_name}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{reg.nickname || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{reg.job_category || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{reg.channels || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{reg.loan_amount_range || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">
                    {reg.loan_before ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF9500]/12 text-[#FF9500]">เคย</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ไม่เคย</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{renderStatusBadge(reg.reg_status)}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">{formatDate(reg.registered_at)}</td>
                </tr>
              ))}
              {!isLoading && (!data || data.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <svg className="w-10 h-10 text-black/20 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                       </svg>
                       <p className="text-[13px]">ไม่พบผู้ลงทะเบียน (0 รายการ)</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegistrantDrawer 
        open={isDrawerOpen} 
        onClose={() => setSelectedReg(null)} 
        data={selectedReg} 
      />
    </div>
  )
}
