import { exportReport } from '@/pages/report/hooks/useReport'
import type { ReportType } from '@/types/report'

interface ReportBuilderProps {
  filters: { seminar_id?: string; report_type?: ReportType | '' }
  setFilter: (key: string, value: string) => void
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1em'
}

export function ReportBuilder({ filters, setFilter }: ReportBuilderProps) {
  const handleExport = (format: 'csv' | 'pdf') => {
    if (filters.seminar_id && filters.report_type) {
      exportReport(filters.seminar_id, filters.report_type as ReportType, format)
    }
  }

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-5">
      <div className="text-[15px] font-semibold text-black dark:text-white mb-4 tracking-tight">
        สร้าง Report
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-1.5">Seminar</label>
          <select
            value={filters.seminar_id || ''}
            onChange={(e) => setFilter('seminar_id', e.target.value)}
            className="w-full h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
            style={selectStyle}
          >
            <option value="">เลือก Seminar...</option>
            <option value="IB_MAR_2026">IB_MAR_2026</option>
            <option value="IB_FEB_2026">IB_FEB_2026</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-1.5">ประเภท Report</label>
          <select
            value={filters.report_type || ''}
            onChange={(e) => setFilter('report_type', e.target.value)}
            className="w-full h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8 relative"
            style={selectStyle}
          >
            <option value="">เลือกประเภท Report...</option>
            <option value="registration_summary">สรุปการลงทะเบียน</option>
            <option value="loan_profile">Loan profile breakdown</option>
            <option value="crm_pipeline">CRM pipeline</option>
            <option value="attendance">Attendance report</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => handleExport('csv')}
          disabled={!filters.seminar_id || !filters.report_type}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          Export CSV
        </button>
        <button 
          onClick={() => handleExport('pdf')}
          disabled={!filters.seminar_id || !filters.report_type}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}
