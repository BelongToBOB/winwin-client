import { useState } from 'react'
import { useBhcRegistrations } from './hooks/useBhcRegistrations'
import { useDeleteBhc } from './hooks/useBhcMutations'
import { BhcDrawer } from './components/BhcDrawer'
import { confirmDelete } from '@/lib/confirm'
import { notify } from '@/lib/toast'
import { formatDate, getInitials } from '@/lib/utils'
import { Drawer } from '@/components/ui/Drawer'
import type { BhcRegistration } from './hooks/useBhcRegistrations'

export function BhcPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useBhcRegistrations({})
  const deleteBhc = useDeleteBhc()

  const [selected, setSelected] = useState<BhcRegistration | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BhcRegistration | null>(null)

  const filtered = (data || []).filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.nickname.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.facebook_name.toLowerCase().includes(q)
    )
  })

  const openAdd = () => { setEditingItem(null); setDrawerOpen(true) }
  const openEdit = (item: BhcRegistration) => { setEditingItem(item); setDrawerOpen(true); setSelected(null) }

  const handleDelete = async (item: BhcRegistration, e: React.MouseEvent) => {
    e.stopPropagation()
    const result = await confirmDelete(`${item.full_name} (${item.nickname})`)
    if (!result.isConfirmed) return
    notify.promise(
      deleteBhc.mutateAsync(item.id),
      { loading: 'กำลังลบ...', success: 'ลบเรียบร้อย', error: 'ไม่สามารถลบได้' },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, เบอร์โทร, Facebook..."
              className="w-full h-9 pl-9 pr-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 placeholder:text-black/30 dark:placeholder:text-white/30"
            />
          </div>
          <div className="text-xs text-black/40 dark:text-white/40">
            {filtered.length} รายการ
          </div>
        </div>
        <button
          onClick={openAdd}
          className="h-8 px-3.5 rounded-xl text-[12px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 active:scale-[0.97] transition-all"
        >
          + เพิ่มผู้ลงทะเบียน
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ–นามสกุล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">ชื่อเล่น</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">เบอร์โทร</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">Facebook</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden lg:table-cell">ช่องทาง</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">วันลงทะเบียน</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={7} className="px-4 py-3">
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
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 font-medium">{reg.full_name}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden sm:table-cell">{reg.nickname}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums">{reg.phone}</td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 hidden md:table-cell">{reg.facebook_name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#AF52DE]/12 text-[#AF52DE]">
                      {reg.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/80 dark:text-white/80 tabular-nums hidden sm:table-cell">{formatDate(reg.created_at)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <span className="inline-flex gap-1.5">
                      <button
                        onClick={() => openEdit(reg)}
                        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={(e) => handleDelete(reg, e)}
                        disabled={deleteBhc.isPending}
                        className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 disabled:opacity-50 transition-colors"
                      >
                        ลบ
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-black/40 dark:text-white/40">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10 text-black/20 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-[13px]">ไม่พบข้อมูล (0 รายการ)</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer (read-only) */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="รายละเอียดผู้ลงทะเบียน BHC">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center text-[15px] font-semibold shrink-0">
                  {getInitials(selected.full_name.split(' ')[0] || '', selected.full_name.split(' ')[1] || '')}
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                    {selected.full_name} ({selected.nickname})
                  </h3>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#AF52DE]/12 text-[#AF52DE]">Business Health Check</span>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">ลงทะเบียนสำเร็จ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openEdit(selected)}
                className="h-7 px-3 rounded-lg text-[12px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
              >
                แก้ไข
              </button>
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">เบอร์โทร</div>
                <div className="text-black/80 dark:text-white/80">{selected.phone}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Facebook</div>
                <div className="text-black/80 dark:text-white/80">{selected.facebook_name}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">ช่องทางที่รู้จัก</div>
                <div className="text-black/80 dark:text-white/80">{selected.channel}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">วันลงทะเบียน</div>
                <div className="text-black/80 dark:text-white/80">{formatDate(selected.created_at)}</div>
              </div>
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            <div className="text-[13px]">
              <div className="text-black/40 dark:text-white/40 mb-1.5">ปัญหาที่พบเจอในธุรกิจเกี่ยวกับบัญชี</div>
              <div className="w-full p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] text-black/80 dark:text-white/80 whitespace-pre-wrap">
                {selected.accounting_problem || '-'}
              </div>
            </div>

            <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

            <div className="text-[13px]">
              <div className="text-black/40 dark:text-white/40 mb-1">Event ID</div>
              <div className="text-black/80 dark:text-white/80 font-mono text-[12px]">{selected.event_id}</div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create/Edit Drawer */}
      <BhcDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} editing={editingItem} />
    </div>
  )
}
