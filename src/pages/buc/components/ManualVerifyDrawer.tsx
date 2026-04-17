import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useManualVerify } from '../hooks/useBuc'
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

interface ManualVerifyDrawerProps {
  open: boolean
  onClose: () => void
}

export function ManualVerifyDrawer({ open, onClose }: ManualVerifyDrawerProps) {
  const manualVerify = useManualVerify()

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    payment_amount: '',
    payment_ref: '',
    notes: '',
  })
  const [slipImage, setSlipImage] = useState<string | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm({ customer_name: '', customer_phone: '', customer_email: '', payment_amount: '', payment_ref: '', notes: '' })
      setSlipImage(null)
      setSlipPreview(null)
      setError('')
    }
  }, [open])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

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
    if (!form.customer_name.trim()) { setError('กรุณากรอกชื่อลูกค้า'); return }
    if (!form.customer_phone.trim()) { setError('กรุณากรอกเบอร์โทร'); return }
    if (!form.payment_amount || Number(form.payment_amount) <= 0) { setError('กรุณากรอกยอดเงิน'); return }

    try {
      const payload: any = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        payment_amount: Number(form.payment_amount),
      }
      if (form.customer_email) payload.customer_email = form.customer_email
      if (form.payment_ref) payload.payment_ref = form.payment_ref
      if (form.notes) payload.notes = form.notes
      if (slipImage) payload.slip_image = slipImage

      const result = await manualVerify.mutateAsync(payload)
      if (result.success) {
        notify.success(`ออก ${result.buc_code} สำเร็จ`)
        onClose()
      } else {
        notify.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      notify.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const loading = manualVerify.isPending

  return (
    <Drawer open={open} onClose={onClose} title="Manual Verify">
      <div className="flex flex-col gap-4 py-2">
        {/* Info banner */}
        <div className="px-3 py-2 rounded-xl bg-[#007AFF]/8 text-[12px] text-[#007AFF]">
          สร้าง BUC แบบ manual — ข้ามการตรวจสอบสลิปผ่าน EasySlip
        </div>

        <FormField label="ชื่อลูกค้า *">
          <input className={inputCls} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="สมชาย ใจดี" />
        </FormField>

        <FormField label="เบอร์โทร *">
          <input className={inputCls} value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} placeholder="08x-xxx-xxxx" />
        </FormField>

        <FormField label="อีเมล">
          <input type="email" className={inputCls} value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="email@example.com" />
        </FormField>

        <FormField label="ยอดเงินที่โอน (บาท) *">
          <input type="number" className={inputCls} value={form.payment_amount} onChange={e => set('payment_amount', e.target.value)} placeholder="4990" />
        </FormField>

        <FormField label="เลขอ้างอิงการโอน">
          <input className={inputCls} value={form.payment_ref} onChange={e => set('payment_ref', e.target.value)} placeholder="เลขอ้างอิงการโอน" />
        </FormField>

        <FormField label="สลิปการชำระเงิน">
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-[13px] text-black/60 dark:text-white/60 file:mr-3 file:h-8 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-medium file:bg-black/[0.06] dark:file:bg-white/[0.08] file:text-black/70 dark:file:text-white/70 file:cursor-pointer" />
          {slipPreview && (
            <img src={slipPreview} alt="slip preview" className="mt-2 max-h-48 object-contain rounded-xl border border-black/[0.08] dark:border-white/[0.08]" />
          )}
        </FormField>

        <FormField label="หมายเหตุ">
          <textarea className={textareaCls} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="หมายเหตุ เช่น จ่ายผ่าน LINE Pay" />
        </FormField>

        {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

        <div className="pt-4 flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <button onClick={onClose} className="h-9 px-4 rounded-xl text-[13px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors">
            ยกเลิก
          </button>
          <button onClick={handleSubmit} disabled={loading} className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5">
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
        </div>
      </div>
    </Drawer>
  )
}
