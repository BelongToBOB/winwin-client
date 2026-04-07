import { useLocation } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

interface CourseEvent {
  seminar_id: string
  course_name: string
}

const titleMap: Record<string, { title: string; subtitle: string }> = {
  '/overview': { title: 'ภาพรวม', subtitle: 'สรุปภาพรวมทั้งหมด' },
  '/registrations': { title: 'ผู้ลงทะเบียน', subtitle: 'รายชื่อผู้ลงทะเบียนเข้าสัมมนา' },
  '/crm': { title: 'ติดตามลูกค้า', subtitle: 'ติดตามสถานะการขายและการกู้' },
  '/report': { title: 'รายงาน', subtitle: 'สร้างและส่งออกรายงาน' },
}

export function Topbar() {
  const location = useLocation()
  const currentPath = Object.keys(titleMap).find((k) => location.pathname.startsWith(k)) || '/overview'
  const { title, subtitle } = titleMap[currentPath]

  const { filters, setFilter } = useUrlFilters({ seminar_id: '' })

  const { data: seminars = [] } = useQuery({
    queryKey: qk.seminars(),
    queryFn: async () => {
      const { data } = await api.get<CourseEvent[]>('/course-events')
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

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
          {seminars.map((s) => (
            <option key={s.seminar_id} value={s.seminar_id}>
              {s.seminar_id} — {s.course_name}
            </option>
          ))}
        </select>
      </div>
    </header>
  )
}
