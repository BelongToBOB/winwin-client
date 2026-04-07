import { useState } from 'react'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useRegistrations } from './hooks/useRegistrations'
import { FilterBar } from './components/FilterBar'
import { RegistrantDrawer } from './components/RegistrantDrawer'
import { AddRegistrantDrawer } from './components/AddRegistrantDrawer'
import { useDeleteRegistration } from './hooks/useRegistrationMutations'
import { confirmDelete } from '@/lib/confirm'
import { notify } from '@/lib/toast'
import { formatDate } from '@/lib/utils'
import type { Registration } from '@/types/registration'

export function RegistrationsPage() {
  const { filters, setFilter } = useUrlFilters({ seminar_id: '', status: '', job: '', loan_range: '', q: '' })
  const filtersRecord = filters as Record<string, string>
  const { data, isLoading } = useRegistrations(filters)

  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const deleteMutation = useDeleteRegistration(filtersRecord)

  const isDrawerOpen = !!selectedReg

  const handleDelete = async (reg: Registration, e: React.MouseEvent) => {
    e.stopPropagation()
    const result = await confirmDelete(`${reg.first_name} ${reg.last_name}`)
    if (!result.isConfirmed) return
    notify.promise(
      deleteMutation.mutateAsync(reg.id),
      { loading: 'กำลังลบ...', success: 'ลบผู้ลงทะเบียนเรียบร้อย', error: 'ไม่สามารถลบได้' },
    )
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':   return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/50 dark:bg-white/[0.08] dark:text-white/50">รอดำเนินการ</span>
      case 'confirmed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#007AFF]/10 text-[#007AFF]">ยืนยันแล้ว</span>
      case 'attended':  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#34C759]/12 text-[#34C759]">เข้าร่วมแล้ว</span>
      case 'no_show':   return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF3B30]/10 text-[#FF3B30]">ไม่มา</span>
      case 'cancelled': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/30 dark:bg-white/[0.06] dark:text-white/30">ยกเลิก</span>
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <FilterBar filters={filters} setFilter={setFilter} />

      <div className="flex items-center justify-between">
        <div className="text-xs text-black/40 dark:text-white/40">
          {data?.length || 0} รายการ
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="h-8 px-3.5 rounded-xl text-[12px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 active:scale-[0.97] transition-all"
        >
          + เพิ่มผู้ลงทะเบียน
        </button>
      </div>

      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ–นามสกุล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">ชื่อเล่น</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">อาชีพ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">ช่องทาง</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">วงเงินกู้</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">เคยกู้</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">วันลงทะเบียน</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={9} className="px-4 py-3">
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
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden sm:table-cell">{reg.nickname || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden md:table-cell">{reg.job_category || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden lg:table-cell">{reg.channels || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden lg:table-cell">{reg.loan_amount_range || '-'}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden md:table-cell">
                    {reg.loan_before ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF9500]/12 text-[#FF9500]">เคย</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ไม่เคย</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{renderStatusBadge(reg.reg_status)}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums hidden sm:table-cell">{formatDate(reg.registered_at)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDelete(reg, e)}
                      disabled={deleteMutation.isPending}
                      className="h-6 px-2 rounded-lg text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 disabled:opacity-50 transition-colors"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (!data || data.length === 0) && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
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
        filters={filtersRecord}
      />

      <AddRegistrantDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        seminarId={filters.seminar_id}
        filters={filtersRecord}
      />
    </div>
  )
}
