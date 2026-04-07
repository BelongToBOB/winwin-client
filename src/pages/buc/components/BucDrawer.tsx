import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useCreateBuc, useUpdateBuc } from '../hooks/useBuc'
import { notify } from '@/lib/toast'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'

interface BucDrawerProps {
  open: boolean
  onClose: () => void
  editing?: any | null
}

export function BucDrawer({ open, onClose, editing }: BucDrawerProps) {
  const isEdit = !!editing
  const create = useCreateBuc()
  const update = useUpdateBuc()

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    package_name: 'Bank Uncensored Online',
    status: 'pending',
    notes: '',
    payment_ref: '',
    payment_amount: '',
  })

  useEffect(() => {
    if (editing) {
      setForm({
        customer_name: editing.customer_name ?? '',
        customer_phone: editing.customer_phone ?? '',
        customer_email: editing.customer_email ?? '',
        package_name: editing.package_name ?? 'Bank Uncensored Online',
        status: editing.status ?? 'pending',
        notes: editing.notes ?? '',
        payment_ref: editing.payment_ref ?? '',
        payment_amount: editing.payment_amount?.toString() ?? '',
      })
    } else {
      setForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        package_name: 'Bank Uncensored Online',
        status: 'pending',
        notes: '',
        payment_ref: '',
        payment_amount: '',
      })
    }
  }, [editing, open])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const loading = create.isPending || update.isPending

  const handleSubmit = async () => {
    const payload = {
      ...form,
      payment_amount: form.payment_amount ? Number(form.payment_amount) : undefined,
    }
    const promise = isEdit
      ? update.mutateAsync({ id: editing.id, ...payload })
      : create.mutateAsync(payload)

    notify.promise(promise, {
      loading: isEdit ? 'กำลังบันทึก...' : 'กำลังออก BUC...',
      success: isEdit ? 'บันทึกเรียบร้อย' : 'ออก BUC เรียบร้อย',
      error: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
    })
    try {
      await promise
      onClose()
    } catch {}
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? `แก้ไข ${editing?.buc_code}` : 'ออก BUC ใหม่'}>
      <div className="flex flex-col gap-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ชื่อลูกค้า">
            <input className={inputCls} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="สมชาย ใจดี" />
          </FormField>
          <FormField label="เบอร์โทร">
            <input className={inputCls} value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} placeholder="08x-xxx-xxxx" />
          </FormField>
        </div>

        <FormField label="อีเมล">
          <input type="email" className={inputCls} value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="email@example.com" />
        </FormField>

        <FormField label="Package">
          <input className={inputCls} value={form.package_name} onChange={e => set('package_name', e.target.value)} />
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

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Payment Ref">
            <input className={inputCls} value={form.payment_ref} onChange={e => set('payment_ref', e.target.value)} placeholder="REF-..." />
          </FormField>
          <FormField label="ยอดชำระ (บาท)">
            <input type="number" className={inputCls} value={form.payment_amount} onChange={e => set('payment_amount', e.target.value)} placeholder="0" />
          </FormField>
        </div>

        <FormField label="หมายเหตุ">
          <textarea
            className="w-full px-3 py-2 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 resize-none"
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </FormField>

        <div className="pt-4 flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-[13px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
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
    </Drawer>
  )
}
