import { useState } from 'react'
import { useSeminars, useDeleteSeminar } from './hooks/useSeminars'
import { SeminarDrawer } from './components/SeminarDrawer'
import { DeleteConfirm } from '@/components/ui/DeleteConfirm'
import { formatDate } from '@/lib/utils'
import type { CourseEvent } from '@/types/registration'

const statusBadge = (status: string) => {
  switch (status) {
    case 'upcoming':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#007AFF]/10 text-[#007AFF]">กำลังจะมาถึง</span>
    case 'ongoing':   return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9500]/12 text-[#FF9500]">กำลังดำเนินการ</span>
    case 'completed': return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">เสร็จสิ้น</span>
    case 'cancelled': return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ยกเลิก</span>
    default: return null
  }
}

export function SeminarsPage() {
  const { data, isLoading } = useSeminars()
  const deleteMutation = useDeleteSeminar()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<CourseEvent | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const openAdd = () => { setEditing(null); setDrawerOpen(true) }
  const openEdit = (ev: CourseEvent) => { setEditing(ev); setDrawerOpen(true) }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-black dark:text-white">สัมมนา</h2>
          <p className="text-[13px] text-black/40 dark:text-white/40 mt-0.5">จัดการสัมมนา</p>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-white bg-[#AF52DE] hover:bg-[#AF52DE]/90 active:scale-[0.97] transition-all"
        >
          + เพิ่มสัมมนา
        </button>
      </div>

      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">รหัสสัมมนา</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อคอร์ส</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">วันที่</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานที่</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ที่นั่ง</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ลงทะเบียน</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-10 rounded-xl" />
                      </td>
                    </tr>
                  ))
                : (data || []).map(ev => (
                    <tr key={ev.id} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-mono text-[12px] text-black/60 dark:text-white/60">{ev.seminar_id}</td>
                      <td className="px-4 py-3 text-black/80 dark:text-white/80 font-medium">{ev.course_name}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60 tabular-nums">{formatDate(ev.event_date) || '-'}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">{ev.venue || '-'}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60 tabular-nums">{ev.max_seats ?? '-'}</td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60 tabular-nums">{ev.total_registrations}</td>
                      <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                      <td className="px-4 py-3">
                        {confirmDelete === ev.id ? (
                          <DeleteConfirm
                            onConfirm={() => deleteMutation.mutate(ev.id, { onSuccess: () => setConfirmDelete(null) })}
                            onCancel={() => setConfirmDelete(null)}
                            loading={deleteMutation.isPending}
                          />
                        ) : (
                          <span className="inline-flex gap-1.5">
                            <button
                              onClick={() => openEdit(ev)}
                              className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => setConfirmDelete(ev.id)}
                              className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 transition-colors"
                            >
                              ลบ
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              {!isLoading && (!data || data.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[13px] text-black/40 dark:text-white/40">
                    ยังไม่มีสัมมนา — กด "+ เพิ่มสัมมนา" เพื่อสร้างใหม่
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SeminarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        event={editing}
      />
    </div>
  )
}
