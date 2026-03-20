import { useLocation } from 'react-router'
import { useUrlFilters } from '@/hooks/useUrlFilters'

const titleMap: Record<string, { title: string; subtitle: string }> = {
  '/overview': { title: 'Overview', subtitle: 'สรุปภาพรวมทั้งหมด' },
  '/registrations': { title: 'Registrations', subtitle: 'รายชื่อผู้ลงทะเบียนเข้าสัมมนา' },
  '/crm': { title: 'CRM Pipeline', subtitle: 'ติดตามสถานะการขายและการกู้' },
  '/report': { title: 'Report', subtitle: 'สร้างและส่งออกรายงาน' },
}

export function Topbar() {
  const location = useLocation()
  const currentPath = Object.keys(titleMap).find((k) => location.pathname.startsWith(k)) || '/overview'
  const { title, subtitle } = titleMap[currentPath]

  const { filters, setFilter } = useUrlFilters({ seminar_id: '' })

  return (
    <header className="sticky top-0 z-10 bg-[#F2F2F7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.08] px-6 h-14 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-black dark:text-white">{title}</h2>
        <p className="text-xs text-black/40 dark:text-white/40">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filters.seminar_id || ''}
          onChange={(e) => setFilter('seminar_id', e.target.value)}
          className="h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1em'
          }}
        >
          <option value="">ทุก seminar</option>
          <option value="IB_MAR_2026">IB_MAR_2026</option>
          <option value="IB_FEB_2026">IB_FEB_2026</option>
        </select>
      </div>
    </header>
  )
}
