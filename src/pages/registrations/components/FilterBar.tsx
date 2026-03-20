import { useRef } from 'react'
import { useKeyboard } from '@/hooks/useKeyboard'

interface FilterBarProps {
  filters: any
  setFilter: (key: string, value: string) => void
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1em'
}

export function FilterBar({ filters, setFilter }: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  useKeyboard({
    '/': (e: KeyboardEvent) => {
      e.preventDefault()
      searchRef.current?.focus()
    }
  })

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative isolate flex-1 min-w-[200px]">
        <input
          ref={searchRef}
          type="text"
          placeholder="ค้นหาชื่อ, อีเมล... (กด /)"
          value={filters.q || ''}
          onChange={(e) => setFilter('q', e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <select
        value={filters.status || ''}
        onChange={(e) => setFilter('status', e.target.value)}
        className="h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
        style={selectStyle}
      >
        <option value="">ทุกสถานะ</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="attended">Attended</option>
        <option value="no_show">No Show</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={filters.job || ''}
        onChange={(e) => setFilter('job', e.target.value)}
        className="h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
        style={selectStyle}
      >
        <option value="">ทุก job</option>
        <option value="เจ้าของธุรกิจ/ธุรกิจส่วนตัว">เจ้าของธุรกิจ/ธุรกิจส่วนตัว</option>
        <option value="พนักงาน">พนักงาน</option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>

      <select
        value={filters.loan_range || ''}
        onChange={(e) => setFilter('loan_range', e.target.value)}
        className="h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
        style={selectStyle}
      >
        <option value="">ทุก loan range</option>
        <option value="50k–100k">50k–100k</option>
        <option value="1M–5M">1M–5M</option>
        <option value="5M–10M">5M–10M</option>
        <option value="มากกว่า 10M">มากกว่า 10M</option>
      </select>
    </div>
  )
}
