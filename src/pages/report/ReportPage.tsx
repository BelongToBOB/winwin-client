import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useReportPreview } from './hooks/useReport'
import { ReportBuilder } from './components/ReportBuilder'
import type { ReportType, ReportRow } from '@/types/report'

interface ColDef { key: string; label: string; signature?: boolean }

const COLUMNS: Record<string, ColDef[]> = {
  registration_summary: [
    { key: '_index',           label: 'ลำดับ' },
    { key: 'first_name',       label: 'ชื่อ' },
    { key: 'last_name',        label: 'นามสกุล' },
    { key: 'nickname',         label: 'ชื่อเล่น' },
    { key: 'email',            label: 'อีเมล' },
    { key: 'phone',            label: 'เบอร์โทร' },
    { key: 'job_category',     label: 'อาชีพ' },
    { key: 'channels',         label: 'ช่องทาง' },
    { key: 'loan_amount_range',label: 'วงเงินกู้' },
    { key: 'reg_status',       label: 'สถานะ' },
  ],
  attendance_sheet: [
    { key: '_index',    label: 'ลำดับ' },
    { key: 'first_name',label: 'ชื่อ' },
    { key: 'last_name', label: 'นามสกุล' },
    { key: 'nickname',  label: 'ชื่อเล่น' },
    { key: 'phone',     label: 'เบอร์โทร' },
    { key: 'signature', label: 'ลายเซ็น', signature: true },
  ],
  buc_summary: [
    { key: '_index',         label: 'ลำดับ' },
    { key: 'buc_code',       label: 'รหัส BUC' },
    { key: 'customer_name',  label: 'ชื่อลูกค้า' },
    { key: 'customer_phone', label: 'เบอร์โทร' },
    { key: 'customer_email', label: 'อีเมล' },
    { key: 'line_id',        label: 'LINE ID' },
    { key: 'payment_amount', label: 'ยอดเงิน' },
    { key: 'status',         label: 'สถานะ' },
    { key: 'issued_at',      label: 'วันที่ออก' },
  ],
}

const REPORT_LABELS: Record<string, string> = {
  registration_summary: 'สรุปการลงทะเบียน',
  attendance_sheet:     'ใบเซ็นชื่อเข้าร่วม',
  buc_summary:          'Bank Uncensored — สรุปรหัส BUC',
}

const BUC_REPORTS = ['buc_summary']

export function ReportPage() {
  const { filters, setFilter } = useUrlFilters({ seminar_id: '', report_type: '' })

  const isBucReport = BUC_REPORTS.includes(filters.report_type)
  const { data, isLoading } = useReportPreview(
    isBucReport ? '_buc' : (filters.seminar_id || ''),
    (filters.report_type as ReportType) || ''
  )

  const cols: ColDef[] = COLUMNS[filters.report_type] ?? []
  const selectedLabel = REPORT_LABELS[filters.report_type] ?? ''

  return (
    <div className="flex flex-col h-full gap-5">
      <ReportBuilder
        filters={{ ...filters, report_type: filters.report_type as ReportType | '' }}
        setFilter={setFilter}
      />

      <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden flex-1">
        {((!filters.seminar_id && !isBucReport) || !filters.report_type) ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-10 h-10 text-black/20 dark:text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-[13px] text-black/40 dark:text-white/40">
              เลือกสัมมนาและประเภทรายงานเพื่อดูตัวอย่าง
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                {isBucReport ? selectedLabel : `${filters.seminar_id} · ${selectedLabel}`}
              </h3>
              {!isLoading && data && (
                <span className="text-[12px] text-black/40 dark:text-white/40">{data.length} รายการ</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                    {cols.map((col) => (
                      <th key={col.key} className="px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase text-black/40 dark:text-white/40 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                        <td colSpan={cols.length || 1} className="px-4 py-3">
                          <div className="animate-pulse bg-black/[0.06] dark:bg-white/[0.08] h-5 w-full rounded" />
                        </td>
                      </tr>
                    ))
                  ) : (data || []).map((row: ReportRow, i) => (
                    <tr key={i} className="border-b border-black/[0.06] dark:border-white/[0.06] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                      {cols.map((col) => {
                        if (col.signature) {
                          return <td key={col.key} className="px-4 py-3 h-10 bg-black/[0.02] dark:bg-white/[0.02]" />
                        }
                        if (col.key === '_index') {
                          return <td key={col.key} className="px-4 py-3 text-black/40 dark:text-white/40 tabular-nums">{i + 1}</td>
                        }
                        return (
                          <td key={col.key} className="px-4 py-3 text-black/80 dark:text-white/80 max-w-[180px] truncate">
                            {row[col.key] || '-'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  {!isLoading && data?.length === 0 && (
                    <tr>
                      <td colSpan={cols.length || 1} className="px-4 py-12 text-center text-black/40 dark:text-white/40">
                        ไม่พบข้อมูล
                      </td>
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
