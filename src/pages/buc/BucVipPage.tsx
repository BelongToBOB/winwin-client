import { useVipInsideBank, useGrantVipBulk } from './hooks/useBuc'
import { notify } from '@/lib/toast'

export function BucVipPage() {
  const { data: vipData, isLoading: vipLoading } = useVipInsideBank()
  const grantVip = useGrantVipBulk()

  const handleGrantAll = () => {
    if (!vipData) return
    const pendingList = vipData.registrants
      .filter((r: any) => r.vip_status === 'pending')
      .map((r: any) => ({ email: r.email, firstName: r.first_name, lastName: r.last_name || '', phone: r.phone }))
    if (pendingList.length === 0) return
    notify.promise(
      grantVip.mutateAsync({ seminarId: 'IB_APR_2026', registrants: pendingList }),
      {
        loading: `กำลังให้สิทธิ์ VIP ${pendingList.length} คน...`,
        success: (data: any) => `สำเร็จ ${data.success} คน${data.failed > 0 ? ` / ล้มเหลว ${data.failed}` : ''}`,
        error: 'เกิดข้อผิดพลาด',
      },
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-black dark:text-white">Bank Uncensored VIP</h2>
          <p className="text-[13px] text-black/40 dark:text-white/40 mt-0.5">
            สิทธิ์พิเศษสำหรับลูกค้า Inside Bank เมษายน 2568
            {vipData && ` — ${vipData.granted}/${vipData.total} คนได้รับสิทธิ์แล้ว`}
          </p>
        </div>
        {vipData && vipData.pending > 0 && (
          <button
            onClick={handleGrantAll}
            disabled={grantVip.isPending}
            className="h-9 px-4 rounded-xl text-[13px] font-medium text-white bg-[#FF9500] hover:bg-[#FF9500]/90 active:scale-[0.97] disabled:opacity-50 transition-all whitespace-nowrap"
          >
            ให้สิทธิ์ VIP ทั้งหมด {vipData.pending} คน
          </button>
        )}
      </div>

      {/* Stat cards */}
      {vipData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl p-4 bg-[#007AFF]/8 border border-black/[0.04] dark:border-white/[0.04]">
            <div className="text-[11px] text-black/40 dark:text-white/40 mb-1">ทั้งหมด</div>
            <div className="text-[22px] font-semibold text-[#007AFF] tabular-nums">{vipData.total}</div>
          </div>
          <div className="rounded-2xl p-4 bg-[#34C759]/8 border border-black/[0.04] dark:border-white/[0.04]">
            <div className="text-[11px] text-black/40 dark:text-white/40 mb-1">ได้รับสิทธิ์แล้ว</div>
            <div className="text-[22px] font-semibold text-[#34C759] tabular-nums">{vipData.granted}</div>
          </div>
          <div className="rounded-2xl p-4 bg-[#FF9500]/8 border border-black/[0.04] dark:border-white/[0.04]">
            <div className="text-[11px] text-black/40 dark:text-white/40 mb-1">รอให้สิทธิ์</div>
            <div className="text-[22px] font-semibold text-[#FF9500] tabular-nums">{vipData.pending}</div>
          </div>
          <div className="rounded-2xl p-4 bg-[#FF3B30]/8 border border-black/[0.04] dark:border-white/[0.04]">
            <div className="text-[11px] text-black/40 dark:text-white/40 mb-1">ไม่มี email</div>
            <div className="text-[22px] font-semibold text-[#FF3B30] tabular-nums">{vipData.no_email}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">ชื่อ</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden sm:table-cell">อีเมล</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 hidden md:table-cell">เบอร์โทร</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">VIP Code</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {vipLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-6 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : (vipData?.registrants || []).map((r: any, i: number) => (
                <tr key={i} className="hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                  <td className="px-4 py-3 text-black/80 dark:text-white/80">{r.first_name} {r.last_name || ''}</td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden sm:table-cell">
                    {r.email || <span className="text-[#FF3B30] text-[12px]">ไม่มี email — ต้องเพิ่มก่อน</span>}
                  </td>
                  <td className="px-4 py-3 text-black/60 dark:text-white/60 hidden md:table-cell">{r.phone || '-'}</td>
                  <td className="px-4 py-3 font-mono text-[12px] font-semibold text-black/80 dark:text-white/80">{r.vip_code || '-'}</td>
                  <td className="px-4 py-3">
                    {r.vip_status === 'granted' && <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">ได้รับสิทธิ์แล้ว</span>}
                    {r.vip_status === 'pending' && <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9500]/12 text-[#FF9500]">รอให้สิทธิ์</span>}
                    {r.vip_status === 'no_email' && <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF3B30]/12 text-[#FF3B30]">ไม่มี email</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
