import { useState } from 'react'
import { useLmsStats, useLmsRegistrations, useRetryEnrollment, useRetryEmail } from './hooks/useLmsAdmin'
import type { LmsRegistration } from './hooks/useLmsAdmin'
import { Drawer } from '@/components/ui/Drawer'
import { notify } from '@/lib/toast'
import { formatDate, getInitials } from '@/lib/utils'

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING_PAYMENT:   { label: 'รอชำระ',    cls: 'bg-black/[0.06] text-black/50 dark:bg-white/[0.06] dark:text-white/50' },
    PAYMENT_INITIATED: { label: 'กำลังชำระ',  cls: 'bg-[#FF9500]/12 text-[#FF9500]' },
    PAID:              { label: 'ชำระแล้ว',   cls: 'bg-[#007AFF]/10 text-[#007AFF]' },
    ENROLLED:          { label: 'Enrolled',   cls: 'bg-[#34C759]/12 text-[#34C759]' },
    ACTIVE:            { label: 'Active',     cls: 'bg-[#34C759]/12 text-[#34C759]' },
    PAYMENT_FAILED:    { label: 'ชำระไม่สำเร็จ', cls: 'bg-[#FF3B30]/10 text-[#FF3B30]' },
    CANCELLED:         { label: 'ยกเลิก',     cls: 'bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40' },
    ENROLLMENT_FAILED: { label: 'Enroll ผิดพลาด', cls: 'bg-[#FF3B30]/10 text-[#FF3B30]' },
  }
  const s = map[status] || { label: status, cls: 'bg-black/[0.06] text-black/40' }
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.cls}`}>{s.label}</span>
}

export function LmsOrdersPage() {
  const { data: stats, isLoading: statsLoading } = useLmsStats()
  const { data: regs, isLoading: regsLoading } = useLmsRegistrations()
  const retryEnrollment = useRetryEnrollment()
  const retryEmail = useRetryEmail()

  const [selected, setSelected] = useState<LmsRegistration | null>(null)
  const [search, setSearch] = useState('')

  const filtered = (regs || []).filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.firstName.toLowerCase().includes(q) || r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) || r.customerCode.toLowerCase().includes(q)
  })

  const handleRetryEnroll = (id: string) => {
    notify.promise(retryEnrollment.mutateAsync(id), {
      loading: 'กำลัง retry enrollment...',
      success: 'Enrollment สำเร็จ',
      error: 'Enrollment ไม่สำเร็จ',
    })
  }

  const handleRetryEmail = (id: string) => {
    notify.promise(retryEmail.mutateAsync(id), {
      loading: 'กำลังส่งอีเมล...',
      success: 'ส่งอีเมลสำเร็จ',
      error: 'ส่งอีเมลไม่สำเร็จ',
    })
  }

  const statCards = [
    { label: 'ทั้งหมด', value: stats?.total ?? 0, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/8' },
    { label: 'Active', value: stats?.active ?? 0, color: 'text-[#34C759]', bg: 'bg-[#34C759]/8' },
    { label: 'ชำระแล้ว (รอ enroll)', value: stats?.paid ?? 0, color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/8' },
    { label: 'ชำระไม่สำเร็จ', value: stats?.failed ?? 0, color: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/8' },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(card => (
          <div key={card.label} className={`rounded-2xl p-4 ${card.bg} border border-black/[0.04] dark:border-white/[0.04]`}>
            <div className="text-[11px] text-black/40 dark:text-white/40 mb-1">{card.label}</div>
            <div className={`text-[22px] font-semibold ${card.color} tabular-nums`}>
              {statsLoading ? '—' : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล, รหัส BUC..."
            className="w-full h-9 pl-9 pr-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 placeholder:text-black/30 dark:placeholder:text-white/30"
          />
        </div>
        <div className="text-xs text-black/40 dark:text-white/40">{filtered.length} รายการ</div>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">รหัส</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">อีเมล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">คอร์ส</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">Enrolled</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">Email</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {regsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={8} className="px-4 py-3">
                      <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-10 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filtered.map((reg) => (
                <tr
                  key={reg.id}
                  onClick={() => setSelected(reg)}
                  className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-[12px] text-black/60 dark:text-white/60">{reg.customerCode}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 font-medium">{reg.firstName} {reg.lastName}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden md:table-cell">{reg.email}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden lg:table-cell">{reg.course.title}</td>
                  <td className="px-4 py-3">{statusBadge(reg.status)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {reg.enrolledAt
                      ? <span className="text-[#34C759] text-[11px]">✓</span>
                      : <span className="text-black/20 dark:text-white/20 text-[11px]">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {reg.welcomeEmailSentAt
                      ? <span className="text-[#34C759] text-[11px]">✓</span>
                      : <span className="text-black/20 dark:text-white/20 text-[11px]">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-black/50 dark:text-white/50 tabular-nums hidden sm:table-cell">{formatDate(reg.createdAt)}</td>
                </tr>
              ))}
              {!regsLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                    <p className="text-[13px]">ยังไม่มีข้อมูล</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="รายละเอียด Registration">
        {selected && (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-[15px] font-semibold shrink-0">
                {getInitials(selected.firstName, selected.lastName)}
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                  {selected.firstName} {selected.lastName}
                </h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#007AFF]/10 text-[#007AFF] font-mono">{selected.customerCode}</span>
                  {statusBadge(selected.status)}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">อีเมล</div>
                <div className="text-black/80 dark:text-white/80">{selected.email}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">เบอร์โทร</div>
                <div className="text-black/80 dark:text-white/80">{selected.phone || '-'}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">คอร์ส</div>
                <div className="text-black/80 dark:text-white/80">{selected.course.title}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">วันลงทะเบียน</div>
                <div className="text-black/80 dark:text-white/80">{formatDate(selected.createdAt)}</div>
              </div>
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            {/* Orders */}
            <div>
              <div className="text-[12px] font-semibold text-black/60 dark:text-white/60 uppercase tracking-wide mb-2">Orders</div>
              {selected.orders.length === 0 ? (
                <p className="text-[13px] text-black/40 dark:text-white/40">ไม่มี order</p>
              ) : selected.orders.map(o => (
                <div key={o.orderNo} className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0">
                  <div>
                    <span className="font-mono text-[12px] text-black/60 dark:text-white/60">{o.orderNo}</span>
                    <span className="text-[11px] text-black/40 dark:text-white/40 ml-2">{o.channelCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-black/60 dark:text-white/60">{Number(o.amount).toLocaleString()}.-</span>
                    {statusBadge(o.status)}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            {/* Status details */}
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Enrolled</div>
                <div className="text-black/80 dark:text-white/80">{selected.enrolledAt ? formatDate(selected.enrolledAt) : '❌ ยังไม่ได้ enroll'}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Welcome Email</div>
                <div className="text-black/80 dark:text-white/80">{selected.welcomeEmailSentAt ? formatDate(selected.welcomeEmailSentAt) : '❌ ยังไม่ได้ส่ง'}</div>
              </div>
            </div>

            {selected.enrollmentError && (
              <div className="rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/25 p-3">
                <div className="text-[12px] font-semibold text-[#FF3B30] mb-1">Enrollment Error</div>
                <p className="text-[12px] text-black/70 dark:text-white/70">{selected.enrollmentError}</p>
              </div>
            )}

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            {/* Retry Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleRetryEnroll(selected.id)}
                disabled={retryEnrollment.isPending}
                className="h-8 px-4 rounded-xl text-[12px] font-medium text-white bg-[#AF52DE] hover:bg-[#AF52DE]/90 disabled:opacity-50 transition-colors"
              >
                {retryEnrollment.isPending ? 'กำลัง...' : '🔄 Retry Enrollment'}
              </button>
              <button
                onClick={() => handleRetryEmail(selected.id)}
                disabled={retryEmail.isPending}
                className="h-8 px-4 rounded-xl text-[12px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
              >
                {retryEmail.isPending ? 'กำลัง...' : '📧 Retry Email'}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
