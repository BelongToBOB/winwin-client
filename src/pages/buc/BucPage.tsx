import { useState } from 'react'
import { useBucStats, useBucList, useDeleteBuc } from './hooks/useBuc'
import { BucDrawer } from './components/BucDrawer'
import { confirmDelete } from '@/lib/confirm'
import { notify } from '@/lib/toast'
import { formatDate } from '@/lib/utils'

const STATUS_TABS = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'รอกรอกฟอร์ม', value: 'pending' },
  { label: 'กรอกแล้ว', value: 'registered' },
  { label: 'Active', value: 'active' },
]

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending':    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9500]/12 text-[#FF9500]">รอกรอกฟอร์ม</span>
    case 'registered': return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">กรอกฟอร์มแล้ว</span>
    case 'active':     return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#007AFF]/10 text-[#007AFF]">Active</span>
    case 'cancelled':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ยกเลิก</span>
    default: return null
  }
}

const copyMessage = (item: any) => {
  const lines = [
    `🔐 รหัส BUC ของคุณคือ: ${item.buc_code}`,
    `📦 Package: ${item.package_name ?? 'Bank Uncensored Online'}`,
    ``,
    `กรุณากรอกฟอร์มลงทะเบียนเพื่อเข้าถึงคอร์สได้เลยครับ/ค่ะ`,
  ]
  return lines.join('\n')
}

export function BucPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const { data: stats, isLoading: statsLoading } = useBucStats()
  const { data: list, isLoading: listLoading } = useBucList(statusFilter || undefined)
  const deleteBuc = useDeleteBuc()

  const openAdd = () => { setEditingItem(null); setDrawerOpen(true) }
  const openEdit = (item: any) => { setEditingItem(item); setDrawerOpen(true) }

  const handleDelete = async (item: any) => {
    const result = await confirmDelete(`${item.buc_code}${item.customer_name ? ` (${item.customer_name})` : ''}`)
    if (!result.isConfirmed) return
    notify.promise(
      deleteBuc.mutateAsync(item.id),
      { loading: 'กำลังลบ...', success: 'ลบเรียบร้อย', error: 'ไม่สามารถลบได้' },
    )
  }

  const handleCopy = (item: any) => {
    navigator.clipboard.writeText(copyMessage(item))
    notify.success(`คัดลอกข้อความ ${item.buc_code} แล้ว`)
  }

  const statCards = [
    { label: 'ออกแล้วทั้งหมด', value: stats?.total ?? 0, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/8' },
    { label: 'รอกรอกฟอร์ม', value: stats?.pending ?? 0, color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/8' },
    { label: 'กรอกฟอร์มแล้ว', value: stats?.registered ?? 0, color: 'text-[#34C759]', bg: 'bg-[#34C759]/8' },
    {
      label: 'BUC ล่าสุด',
      value: stats?.last_buc_number ? `BUC${String(stats.last_buc_number).padStart(4, '0')}` : '-',
      color: 'text-[#AF52DE]',
      bg: 'bg-[#AF52DE]/8',
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-black dark:text-white">Bank Uncensored</h2>
          <p className="text-[13px] text-black/40 dark:text-white/40 mt-0.5">จัดการรหัสลูกค้าคอร์สออนไลน์</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 active:scale-[0.97] transition-all"
        >
          + ออก BUC ใหม่
        </button>
      </div>

      {/* Stat cards */}
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

      {/* Filter tabs */}
      <div className="flex gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-xl w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-white dark:bg-[#2C2C2E] text-black dark:text-white shadow-sm'
                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">รหัส BUC</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">ชื่อลูกค้า</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">เบอร์โทร</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">อีเมล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">วันที่ออก</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-8 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : (list || []).map((item: any) => (
                <tr key={item.id} className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                  <td className="px-4 py-3 font-mono text-[12px] font-semibold text-black/80 dark:text-white/80">{item.buc_code}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden sm:table-cell">{item.customer_name || '-'}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden md:table-cell">{item.customer_phone || '-'}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden lg:table-cell">{item.customer_email || '-'}</td>
                  <td className="px-4 py-3">{statusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-black/50 dark:text-white/50 tabular-nums hidden sm:table-cell">{formatDate(item.issued_at)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex gap-1.5">
                      <button
                        onClick={() => handleCopy(item)}
                        title="คัดลอกข้อความ"
                        className="h-6 w-6 rounded-lg flex items-center justify-center text-black/40 dark:text-white/40 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleteBuc.isPending}
                        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 disabled:opacity-50 transition-colors"
                      >
                        ลบ
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {!listLoading && (!list || list.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-black/20 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <p className="text-[13px]">ยังไม่มีรหัส BUC — กด "+ ออก BUC ใหม่"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BucDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} editing={editingItem} />
    </div>
  )
}
