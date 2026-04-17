import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useCreateBuc, useUpdateBuc, useBucStats } from '../hooks/useBuc'
import { notify } from '@/lib/toast'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'
const textareaCls = 'w-full px-3 py-2 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 resize-none'

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

const parseNotes = (notes: string) => {
  try {
    return JSON.parse(notes)
  } catch {
    return null
  }
}

const formatThaiDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const SKILL_LABELS: Record<string, string> = {
  beginner: 'มือใหม่',
  basic: 'พอมีพื้นฐาน',
  intermediate: 'ระดับจัดการ',
  advanced: 'ระดับเชี่ยวชาญ',
}

const GOAL_LABELS: Record<string, string> = {
  scale_up: 'Scale Up',
  fundraising: 'Fundraising / Loan',
  profit: 'Profit Optimization',
  risk: 'Risk Management',
  legacy: 'Legacy / System',
}

interface BucDrawerProps {
  open: boolean
  onClose: () => void
  editing?: any | null
}

function buildCopyMessage(item: any): string {
  return [
    `🔐 รหัส BUC ของคุณคือ: ${item.buc_code}`,
    `📦 Package: ${item.package_name ?? 'Bank Uncensored Online'}`,
    ``,
    `กรุณากรอกฟอร์มลงทะเบียนเพื่อเข้าถึงคอร์สได้เลยครับ/ค่ะ`,
  ].join('\n')
}

export function BucDrawer({ open, onClose, editing }: BucDrawerProps) {
  const isEdit = !!editing
  const create = useCreateBuc()
  const update = useUpdateBuc()
  const { data: stats } = useBucStats()

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    package_name: 'Bank Uncensored Online',
    status: 'pending',
    notes: '',
    payment_amount: '',
    payment_ref: '',
  })
  const [slipImage, setSlipImage] = useState<string | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [createdBuc, setCreatedBuc] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          customer_name: editing.customer_name ?? '',
          customer_phone: editing.customer_phone ?? '',
          customer_email: editing.customer_email ?? '',
          package_name: editing.package_name ?? 'Bank Uncensored Online',
          status: editing.status ?? 'pending',
          notes: editing.notes ?? '',
          payment_amount: editing.payment_amount != null ? String(editing.payment_amount) : '',
          payment_ref: editing.payment_ref ?? '',
        })
      } else {
        setForm({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          package_name: 'Bank Uncensored Online',
          status: 'pending',
          notes: '',
          payment_amount: '',
          payment_ref: '',
        })
      }
      setSlipImage(null)
      setSlipPreview(null)
      setError('')
      setCreatedBuc(null)
      setCopied(false)
    }
  }, [editing, open])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const loading = create.isPending || update.isPending

  const nextBucPreview = stats?.last_buc_number != null
    ? `BUC${String(stats.last_buc_number + 1).padStart(4, '0')}`
    : null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await toBase64(file)
      setSlipImage(base64)
      setSlipPreview(base64)
    } catch {
      notify.error('ไม่สามารถอ่านไฟล์ได้')
    }
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.customer_name.trim()) {
      setError('กรุณากรอกชื่อลูกค้า')
      return
    }

    if (isEdit) {
      try {
        const payload: any = {
          id: editing.id,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email,
          package_name: form.package_name,
          status: form.status,
          notes: form.notes || undefined,
          payment_amount: form.payment_amount ? Number(form.payment_amount) : undefined,
          payment_ref: form.payment_ref || undefined,
        }
        if (slipImage) payload.slip_image = slipImage
        await update.mutateAsync(payload)
        notify.success('บันทึกเรียบร้อย')
        onClose()
      } catch {
        notify.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
      return
    }

    try {
      const result = await create.mutateAsync(form)
      notify.success(`ออก BUC ${result.buc_code} สำเร็จ`)
      setCreatedBuc(result)
    } catch {
      notify.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const handleConfirmPayment = async () => {
    setError('')
    if (!form.payment_amount || Number(form.payment_amount) <= 0) {
      setError('กรุณากรอกยอดเงินที่โอน')
      return
    }
    if (!form.customer_name.trim()) {
      setError('กรุณากรอกชื่อลูกค้า')
      return
    }

    try {
      const payload: any = {
        id: editing.id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        package_name: form.package_name,
        status: form.status,
        notes: form.notes || undefined,
        payment_amount: Number(form.payment_amount),
        payment_ref: form.payment_ref || undefined,
      }
      if (slipImage) payload.slip_image = slipImage
      await update.mutateAsync(payload)
      notify.success('ยืนยันการชำระเงินสำเร็จ')
      onClose()
    } catch {
      notify.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const handleCopy = () => {
    if (!createdBuc) return
    navigator.clipboard.writeText(buildCopyMessage(createdBuc))
    setCopied(true)
    notify.success('คัดลอกข้อความแล้ว')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDone = () => {
    setCreatedBuc(null)
    onClose()
  }

  const hasValidSlipUrl = editing?.slip_url && editing.slip_url !== 'mock://no-slip' && editing.slip_url !== 'mock://slip'
  const showConfirmPayment = isEdit && (editing?.status === 'pending' || !editing?.payment_amount)

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'แก้ไขข้อมูล' : 'ออก BUC ใหม่'}>
      {createdBuc ? (
        /* ── Success state after create ── */
        <div className="flex flex-col gap-5 py-2">
          {/* Code badge */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-[#34C759]/12 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] text-black/40 dark:text-white/40">รหัส BUC ที่ออกสำเร็จ</p>
              <p className="text-[28px] font-bold font-mono text-black dark:text-white tracking-wider mt-0.5">
                {createdBuc.buc_code}
              </p>
              {createdBuc.customer_name && (
                <p className="text-[13px] text-black/60 dark:text-white/60 mt-1">{createdBuc.customer_name}</p>
              )}
            </div>
          </div>

          {/* Copy message box */}
          <div>
            <div className="text-[11px] text-black/40 dark:text-white/40 uppercase tracking-wide mb-2">ข้อความสำหรับส่งลูกค้า</div>
            <div className="rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] p-3">
              <pre className="text-[13px] text-black/80 dark:text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
                {buildCopyMessage(createdBuc)}
              </pre>
            </div>
            <button
              onClick={handleCopy}
              className="mt-2 w-full h-9 rounded-xl text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-2 border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-black/70 dark:text-white/70"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  คัดลอกแล้ว
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  คัดลอกข้อความ
                </>
              )}
            </button>
          </div>

          {/* Next BUC preview */}
          {nextBucPreview && (
            <div className="px-3 py-2 rounded-xl bg-[#007AFF]/8 text-[12px] text-[#007AFF] text-center">
              BUC ถัดไปจะเป็น <span className="font-mono font-semibold">{nextBucPreview}</span>
            </div>
          )}

          <div className="pt-2 flex gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            <button
              onClick={() => { setCreatedBuc(null); setForm({ customer_name: '', customer_phone: '', customer_email: '', package_name: 'Bank Uncensored Online', status: 'pending', notes: '', payment_amount: '', payment_ref: '' }); setError('') }}
              className="flex-1 h-9 rounded-xl text-[13px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
            >
              ออก BUC อีกใบ
            </button>
            <button
              onClick={handleDone}
              className="flex-1 h-9 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 transition-colors"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      ) : (
        /* ── Form state ── */
        <div className="flex flex-col gap-4 py-2">
          {/* Next BUC preview (create mode only) */}
          {!isEdit && nextBucPreview && (
            <div className="px-3 py-2 rounded-xl bg-[#007AFF]/8 text-[12px] text-[#007AFF]">
              รหัสที่จะออก: <span className="font-mono font-semibold">{nextBucPreview}</span>
            </div>
          )}

          {/* Edit mode — dates + parsed registration data */}
          {isEdit && (
            <>
              {/* Dates + LINE ID (read-only) */}
              <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] px-3 py-2.5 flex flex-col gap-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-black/40 dark:text-white/40">วันที่ออก BUC</span>
                  <span className="text-black/70 dark:text-white/70">{formatThaiDate(editing.issued_at)}</span>
                </div>
                {editing.registered_at && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-black/40 dark:text-white/40">วันที่ลงทะเบียน</span>
                    <span className="text-[#34C759]">{formatThaiDate(editing.registered_at)}</span>
                  </div>
                )}
                {editing.line_id && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-black/40 dark:text-white/40">LINE ID</span>
                    <span className="text-black/70 dark:text-white/70">{editing.line_id}</span>
                  </div>
                )}
              </div>

              {/* ── Payment info (editable) ── */}
              <div className="rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/15 px-3 py-3 flex flex-col gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#007AFF]/70">ข้อมูลการชำระเงิน</div>

                <FormField label="ยอดเงินที่โอน (บาท)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.payment_amount}
                    onChange={e => set('payment_amount', e.target.value)}
                    placeholder="กรอกยอดเงิน"
                  />
                </FormField>

                <FormField label="เลขอ้างอิงการโอน">
                  <input
                    className={inputCls}
                    value={form.payment_ref}
                    onChange={e => set('payment_ref', e.target.value)}
                    placeholder="เลขอ้างอิงการโอน"
                  />
                </FormField>

                <FormField label="สลิปการชำระเงิน">
                  {hasValidSlipUrl && !slipPreview && (
                    <a
                      href={editing.slip_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mb-2"
                    >
                      <img
                        src={editing.slip_url}
                        alt="slip"
                        className="max-h-48 object-contain rounded-xl border border-black/[0.08] dark:border-white/[0.08]"
                      />
                    </a>
                  )}
                  {slipPreview && (
                    <img
                      src={slipPreview}
                      alt="slip preview"
                      className="max-h-48 object-contain rounded-xl border border-black/[0.08] dark:border-white/[0.08] mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-[13px] text-black/60 dark:text-white/60 file:mr-3 file:h-8 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-medium file:bg-black/[0.06] dark:file:bg-white/[0.08] file:text-black/70 dark:file:text-white/70 file:cursor-pointer"
                  />
                </FormField>
              </div>

              {/* Parsed notes from registration form */}
              {editing.notes && (() => {
                const n = parseNotes(editing.notes)
                if (!n) return null
                const infoRow = (label: string, value: string) => (
                  <div key={label} className="flex justify-between gap-3 text-[12px]">
                    <span className="text-black/40 dark:text-white/40 shrink-0">{label}</span>
                    <span className="text-black/70 dark:text-white/70 text-right">{value}</span>
                  </div>
                )
                const rows = [
                  n.source?.length > 0 ? infoRow('รู้จักจาก', n.source.join(', ')) : null,
                  n.skill_level ? infoRow('ประสบการณ์', SKILL_LABELS[n.skill_level] ?? n.skill_level) : null,
                  n.goal?.length > 0 ? infoRow('เป้าหมาย', n.goal.map((g: string) => GOAL_LABELS[g] ?? g).join(', ')) : null,
                  n.interested_topics ? infoRow('หัวข้อที่สนใจ', n.interested_topics) : null,
                ].filter(Boolean)
                if (rows.length === 0) return null
                return (
                  <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-black/30 dark:text-white/30 mb-2.5">ข้อมูลจากฟอร์มลงทะเบียน</div>
                    <div className="flex flex-col gap-2">{rows}</div>
                  </div>
                )
              })()}

              {/* Receipt */}
              {editing.needs_receipt ? (
                <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-black/30 dark:text-white/30 mb-2.5">ใบเสร็จ / ใบกำกับภาษี</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">ประเภท</span>
                      <span className="text-black/70 dark:text-white/70">{editing.receipt_type === 'company' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">ชื่อ</span>
                      <span className="text-black/70 dark:text-white/70 text-right">{editing.receipt_name || '-'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">ที่อยู่</span>
                      <span className="text-black/70 dark:text-white/70 text-right max-w-[60%]">{editing.receipt_address || '-'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">เลขภาษี</span>
                      <span className="text-black/70 dark:text-white/70 font-mono">{editing.receipt_tax_id || '-'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">อีเมลรับใบเสร็จ</span>
                      <span className="text-black/70 dark:text-white/70">{editing.receipt_email || '-'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between text-[12px]">
                  <span className="text-black/40 dark:text-white/40">ใบเสร็จ/ใบกำกับภาษี</span>
                  <span className="text-black/50 dark:text-white/50">ไม่ต้องการ</span>
                </div>
              )}

              {/* Withholding */}
              {editing.needs_withholding ? (
                <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-orange-500/70 mb-2.5">หัก ณ ที่จ่าย 3%</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">เบอร์ติดต่อฝ่ายบัญชี</span>
                      <span className="text-black/70 dark:text-white/70">{editing.withholding_contact || '-'}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-black/40 dark:text-white/40">ยืนยันส่งเอกสาร</span>
                      <span className="text-[#34C759]">{editing.withholding_acknowledged ? '✅ ยืนยันแล้ว' : '❌ ยังไม่ยืนยัน'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between text-[12px]">
                  <span className="text-black/40 dark:text-white/40">หัก ณ ที่จ่าย</span>
                  <span className="text-black/50 dark:text-white/50">ไม่ต้องการ</span>
                </div>
              )}
            </>
          )}

          <FormField label="ชื่อลูกค้า *">
            <input
              className={inputCls}
              value={form.customer_name}
              onChange={e => set('customer_name', e.target.value)}
              placeholder="สมชาย ใจดี"
            />
          </FormField>

          <FormField label="เบอร์โทร">
            <input
              className={inputCls}
              value={form.customer_phone}
              onChange={e => set('customer_phone', e.target.value)}
              placeholder="08x-xxx-xxxx"
            />
          </FormField>

          <FormField label="อีเมล">
            <input
              type="email"
              className={inputCls}
              value={form.customer_email}
              onChange={e => set('customer_email', e.target.value)}
              placeholder="email@example.com"
            />
          </FormField>

          <FormField label="แพคเกจ">
            <input
              className={inputCls}
              value={form.package_name}
              onChange={e => set('package_name', e.target.value)}
            />
          </FormField>

          {isEdit && (
            <FormField label="สถานะ">
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="pending">รอกรอกฟอร์ม</option>
                <option value="registered">กรอกฟอร์มแล้ว</option>
                <option value="active">Active</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </FormField>
          )}

          <FormField label="หมายเหตุ">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="หมายเหตุ เช่น จ่ายผ่าน LINE Pay"
            />
          </FormField>

          {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

          <div className="pt-4 flex flex-col gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
            {showConfirmPayment && (
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full h-9 rounded-xl text-[13px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    กำลังดำเนินการ...
                  </>
                ) : 'ยืนยันการชำระเงิน'}
              </button>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : isEdit ? 'บันทึก' : 'ออก BUC'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
