import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useReportPreview } from './hooks/useReport'
import { ReportBuilder } from './components/ReportBuilder'
import type { ReportType } from '@/types/report'

export function ReportPage() {
  const { filters, setFilter } = useUrlFilters({ seminar_id: '', report_type: '' })
  
  const { data, isLoading } = useReportPreview(
    filters.seminar_id || '', 
    (filters.report_type as ReportType) || ''
  )

  const reportTypeLabelMap: Record<string, string> = {
    'registration_summary': 'สรุปการลงทะเบียน',
    'loan_profile': 'Loan profile breakdown',
    'crm_pipeline': 'CRM pipeline',
    'attendance': 'Attendance report'
  }

  const selectedLabel = filters.report_type ? reportTypeLabelMap[filters.report_type] : ''

  return (
    <div className="flex flex-col h-full gap-5">
      <ReportBuilder filters={filters} setFilter={setFilter} />

      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden flex-1">
        {(!filters.seminar_id || !filters.report_type) ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-10 h-10 text-black/20 dark:text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-[13px] text-black/40 dark:text-white/40">
              เลือก seminar และประเภท report เพื่อดู preview
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                Preview — {filters.seminar_id} · {selectedLabel}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 w-1/2">Metric</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 w-1/2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 odd:bg-transparent even:bg-black/[0.02] dark:even:bg-white/[0.03]">
                        <td colSpan={2} className="px-4 py-3">
                          <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-5 w-full rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : (data || []).map((row, index) => (
                    <tr key={index} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 odd:bg-transparent even:bg-black/[0.02] dark:even:bg-white/[0.03] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-3 text-black/80 dark:text-white/80">{row.metric}</td>
                      <td className="px-4 py-3 font-medium text-black dark:text-white">{row.value}</td>
                    </tr>
                  ))}
                  {!isLoading && data?.length === 0 && (
                     <tr>
                       <td colSpan={2} className="px-4 py-12 text-center text-black/40 dark:text-white/40">ไม่พบข้อมูล Preview</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
