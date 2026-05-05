import { useState } from 'react'
import { usePcStats, usePcList, useDeletePc, useUpdatePc } from './hooks/usePrivateConsult'
import { confirmDelete } from '@/lib/confirm'
import { notify } from '@/lib/toast'
import { formatDate } from '@/lib/utils'

const STATUS_TABS = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'รอติดต่อ', value: 'pending' },
  { label: 'ติดต่อแล้ว', value: 'contacted' },
  { label: 'นัดแล้ว', value: 'scheduled' },
  { label: 'เสร็จสิ้น', value: 'completed' },
]

const statusBadge = (status: string) => {
  switch (status) {
    case 'pending':    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9500]/12 text-[#FF9500]">รอติดต่อ</span>
    case 'contacted':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#007AFF]/10 text-[#007AFF]">ติดต่อแล้ว</span>
    case 'scheduled':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#AF52DE]/10 text-[#AF52DE]">นัดแล้ว</span>
    case 'completed':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">เสร็จสิ้น</span>
    default: return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">{status}</span>
  }
}

export function PrivateConsultPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: stats, isLoading: statsLoading } = usePcStats()
  const { data: list, isLoading: listLoading } = usePcList()
  const deletePc = useDeletePc()
  const updatePc = useUpdatePc()

  const handleDelete = async (item: any) => {
    const result = await confirmDelete(`${item.full_name}`)
    if (!result.isConfirmed) return
    notify.promise(
      deletePc.mutateAsync(item.id),
      { loading: 'กำลังลบ...', success: 'ลบเรียบร้อย', error: 'ไม่สามารถลบได้' },
    )
  }

  const handleStatusChange = (item: any, newStatus: string) => {
    notify.promise(
      updatePc.mutateAsync({ id: item.id, status: newStatus }),
      { loading: 'กำลังอัพเดท...', success: 'อัพเดทสถานะแล้ว', error: 'ไม่สามารถอัพเดทได้' },
    )
  }

  const filtered = statusFilter
    ? (list || []).filter((item: any) => item.status === statusFilter)
    : (list || [])

  const statCards = [
    { label: 'ทั้งหมด', value: stats?.total ?? 0, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/8' },
    { label: 'รอติดต่อ', value: stats?.pending ?? 0, color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/8' },
    { label: 'ติดต่อแล้ว', value: stats?.contacted ?? 0, color: 'text-[#007AFF]', bg: 'bg-[#007AFF]/8' },
    { label: 'นัดแล้ว', value: stats?.scheduled ?? 0, color: 'text-[#AF52DE]', bg: 'bg-[#AF52DE]/8' },
    { label: 'เสร็จสิ้น', value: stats?.completed ?? 0, color: 'text-[#34C759]', bg: 'bg-[#34C759]/8' },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-semibold text-black dark:text-white">Private Consult</h2>
        <p className="text-[13px] text-black/40 dark:text-white/40 mt-0.5">รายการลงทะเบียนปรึกษาส่วนตัว</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">ธุรกิจ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">เบอร์โทร</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">รายได้/เดือน</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">วันที่</th>
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
              ) : filtered.map((item: any) => (
                <>
                  <tr key={item.id} className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td className="px-4 py-3">
                      <div className="text-black/80 dark:text-white/80 font-medium">{item.full_name}</div>
                      <div className="text-[11px] text-black/40 dark:text-white/40">{item.nickname}</div>
                    </td>
                    <td className="px-4 py-3 text-black/70 dark:text-white/70 hidden sm:table-cell">{item.business_name || '-'}</td>
                    <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden md:table-cell">{item.phone || '-'}</td>
                    <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden lg:table-cell text-[12px]">{item.monthly_revenue || '-'}</td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-black/50 dark:text-white/50 tabular-nums hidden sm:table-cell">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex gap-1.5">
                        <button
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
                        >
                          {expandedId === item.id ? 'ซ่อน' : 'ดูเพิ่ม'}
                        </button>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item, e.target.value)}
                          className="h-6 px-1 rounded-lg text-[11px] bg-black/[0.04] dark:bg-white/[0.06] border-0 text-black/60 dark:text-white/60"
                        >
                          <option value="pending">รอติดต่อ</option>
                          <option value="contacted">ติดต่อแล้ว</option>
                          <option value="scheduled">นัดแล้ว</option>
                          <option value="completed">เสร็จสิ้น</option>
                        </select>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deletePc.isPending}
                          className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 disabled:opacity-50 transition-colors"
                        >
                          ลบ
                        </button>
                      </span>
                    </td>
                  </tr>
                  {expandedId === item.id && (
                    <tr key={item.id + '-detail'} className="border-b border-black/[0.06] dark:border-white/[0.06]">
                      <td colSpan={7} className="px-6 py-4 bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[12px]">
                          <div><span className="text-black/40 dark:text-white/40">อีเมล:</span> <span className="text-black/80 dark:text-white/80">{item.email || '-'}</span></div>
                          <div><span className="text-black/40 dark:text-white/40">LINE:</span> <span className="text-black/80 dark:text-white/80">{item.line_id || '-'}</span></div>
                          <div><span className="text-black/40 dark:text-white/40">ประเภทธุรกิจ:</span> <span className="text-black/80 dark:text-white/80">{item.business_type || '-'}</span></div>
                          <div className="col-span-2 md:col-span-3">
                            <span className="text-black/40 dark:text-white/40">หัวข้อปรึกษา:</span>{' '}
                            <span className="text-black/80 dark:text-white/80">
                              {Array.isArray(item.consult_topics) ? item.consult_topics.join(', ') : '-'}
                            </span>
                          </div>
                          <div className="col-span-2 md:col-span-3">
                            <span className="text-black/40 dark:text-white/40">ช่องทาง:</span>{' '}
                            <span className="text-black/80 dark:text-white/80">
                              {Array.isArray(item.channel) ? item.channel.join(', ') : '-'}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {!listLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                    <p className="text-[13px]">ยังไม่มีรายการลงทะเบียน</p>
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
