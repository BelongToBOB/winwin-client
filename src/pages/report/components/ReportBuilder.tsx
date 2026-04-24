import { useSeminars } from '@/pages/seminars/hooks/useSeminars'
import { exportReport } from '@/pages/report/hooks/useReport'
import { api } from '@/lib/api'
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
  const { data: seminars = [] } = useSeminars()

  const isBucReport = filters.report_type === 'buc_summary'
  const canExport = !!(filters.report_type && (isBucReport || filters.seminar_id))

  const handleExportCsv = () => {
    if (canExport) exportReport(isBucReport ? '' : filters.seminar_id!, filters.report_type as ReportType, 'csv')
  }

  const handleExportPdf = async () => {
    if (!canExport) return
    const seminar_id = isBucReport ? '' : filters.seminar_id!
    const report_type = filters.report_type as ReportType
    try {
      const res = await api.get('/report/preview', { params: { seminar_id, type: report_type } })
      const rows = res.data
      const seminarName = seminars.find((s) => s.seminar_id === seminar_id)?.course_name || ''
      const printDate = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })

      let title = ''
      let thead = ''
      let tbody = ''

      if (report_type === 'registration_summary') {
        title = `สรุปการลงทะเบียน — ${seminar_id} ${seminarName}`
        thead = `<tr>
          <th>ลำดับ</th><th>ชื่อ</th><th>นามสกุล</th><th>ชื่อเล่น</th>
          <th>อีเมล</th><th>เบอร์โทร</th><th>อาชีพ</th>
          <th>ช่องทาง</th><th>วงเงินกู้</th><th>สถานะ</th>
        </tr>`
        tbody = rows.map((r: any, i: number) => `<tr>
          <td>${i + 1}</td>
          <td>${r.first_name || '-'}</td>
          <td>${r.last_name || '-'}</td>
          <td>${r.nickname || '-'}</td>
          <td>${r.email || '-'}</td>
          <td>${r.phone || '-'}</td>
          <td>${r.job_category || '-'}</td>
          <td>${r.channels || '-'}</td>
          <td>${r.loan_amount_range || '-'}</td>
          <td>${r.reg_status || '-'}</td>
        </tr>`).join('')
      } else if (report_type === 'attendance_sheet') {
        const TOTAL_ROWS = 25
        title = `ใบเซ็นชื่อเข้าร่วม — ${seminar_id} ${seminarName}`
        thead = `<tr>
          <th style="width:36px">ลำดับ</th>
          <th>ชื่อ</th><th>นามสกุล</th><th>ชื่อเล่น</th>
          <th>เบอร์โทร</th>
          <th style="width:160px">ลายเซ็น</th>
        </tr>`
        const dataRows = rows.slice(0, TOTAL_ROWS).map((r: any, i: number) => `<tr>
          <td style="text-align:center">${i + 1}</td>
          <td>${r.first_name || '-'}</td>
          <td>${r.last_name || '-'}</td>
          <td>${r.nickname || '-'}</td>
          <td>${r.phone || '-'}</td>
          <td></td>
        </tr>`).join('')
        const emptyRows = Array.from({ length: Math.max(0, TOTAL_ROWS - rows.length) }, (_, i) => `<tr>
          <td style="text-align:center">${rows.length + i + 1}</td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>`).join('')
        tbody = dataRows + emptyRows
      } else if (report_type === 'buc_summary') {
        title = `Bank Uncensored — สรุปรหัส BUC`
        thead = `<tr>
          <th style="width:40px">ลำดับ</th>
          <th>รหัส BUC</th><th>ชื่อลูกค้า</th><th>เบอร์โทร</th>
          <th>อีเมล</th><th>LINE ID</th><th>ยอดเงิน</th><th>สถานะ</th><th>วันที่ออก</th>
        </tr>`
        tbody = rows.map((r: any, i: number) => `<tr>
          <td style="text-align:center">${i + 1}</td>
          <td>${r.buc_code || '-'}</td>
          <td>${r.customer_name || '-'}</td>
          <td>${r.customer_phone || '-'}</td>
          <td>${r.customer_email || '-'}</td>
          <td>${r.line_id || '-'}</td>
          <td>${r.payment_amount || '-'}</td>
          <td>${r.status || '-'}</td>
          <td>${r.issued_at || '-'}</td>
        </tr>`).join('')
      }

      const html = `<!DOCTYPE html><html lang="th"><head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Sarabun',sans-serif; font-size:13px; color:#000; padding:6mm 6mm 4mm; }
          .header { text-align:center; margin-bottom:2px; }
          .header h1 { font-size:15px; font-weight:700; line-height:1.1; }
          .header p { font-size:11px; color:#444; margin-top:1px; }
          .meta { display:flex; justify-content:space-between; font-size:10px; color:#666; margin-bottom:2px; }
          table { width:100%; border-collapse:collapse; font-size:14px; table-layout:fixed; }
          th { background:#1e293b; color:#fff; padding:4px 6px; text-align:left; font-weight:600; border:1px solid #333; font-size:14px; line-height:1.3; }
          td { padding:3px 6px; border:1px solid #bbb; vertical-align:middle; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; line-height:1.3; height:7mm; }
          tr:nth-child(even) td { background:#f8f8f8; }
          .footer { margin-top:2px; font-size:9px; color:#999; text-align:right; }
          @media print { @page { size:A4 landscape; margin:6mm; } body { padding:0; } }
        </style>
      </head><body>
        <div class="header">
          <h1>WinWin Wealth Creation</h1>
          <p>${title}</p>
        </div>
        <div class="meta">
          <span>จำนวนทั้งหมด: ${rows.length} คน</span>
          <span>วันที่พิมพ์: ${printDate}</span>
        </div>
        <table><thead>${thead}</thead><tbody>${tbody}</tbody></table>
        <div class="footer">WinWin Wealth Creation Co., Ltd. — ระบบจัดการภายใน</div>
        <script>window.onload = function(){ window.print(); }</script>
      </body></html>`

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      if (win) win.onafterprint = () => URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export error', err)
    }
  }

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-5">
      <div className="text-[15px] font-semibold text-black dark:text-white mb-4 tracking-tight">
        สร้างรายงาน
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] text-black/60 dark:text-white/60 mb-1.5">ประเภทรายงาน</label>
          <select
            value={filters.report_type || ''}
            onChange={(e) => setFilter('report_type', e.target.value)}
            className="w-full h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8"
            style={selectStyle}
          >
            <option value="">เลือกประเภทรายงาน...</option>
            <optgroup label="สัมมนา">
              <option value="registration_summary">สรุปการลงทะเบียน</option>
              <option value="attendance_sheet">ใบเซ็นชื่อเข้าร่วม</option>
            </optgroup>
            <optgroup label="คอร์สออนไลน์">
              <option value="buc_summary">Bank Uncensored — สรุปรหัส BUC</option>
            </optgroup>
          </select>
        </div>

        {!isBucReport && (
          <div>
            <label className="block text-[13px] text-black/60 dark:text-white/60 mb-1.5">สัมมนา</label>
            <select
              value={filters.seminar_id || ''}
              onChange={(e) => setFilter('seminar_id', e.target.value)}
              className="w-full h-9 px-3 text-[13px] rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border-0 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all duration-200 cursor-pointer appearance-none pr-8"
              style={selectStyle}
            >
              <option value="">เลือกสัมมนา...</option>
              {seminars.map((s) => (
                <option key={s.seminar_id} value={s.seminar_id}>
                  {s.seminar_id} — {s.course_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleExportCsv}
          disabled={!canExport}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          ส่งออก CSV
        </button>
        <button
          onClick={handleExportPdf}
          disabled={!canExport}
          className="h-9 px-4 rounded-xl text-[13px] font-medium text-white bg-[#FF3B30] hover:bg-[#FF3B30]/90 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          ส่งออก PDF
        </button>
      </div>
    </div>
  )
}
