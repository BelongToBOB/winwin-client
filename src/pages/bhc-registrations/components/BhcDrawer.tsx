import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useCreateBhc, useUpdateBhc } from '../hooks/useBhcMutations'
import { notify } from '@/lib/toast'
import type { BhcRegistration } from '../hooks/useBhcRegistrations'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'
const textareaCls = 'w-full px-3 py-2 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 resize-none'

interface BhcDrawerProps {
  open: boolean
  onClose: () => void
  editing: BhcRegistration | null
}

const emptyForm = {
  full_name: '',
  nickname: '',
  phone: '',
  facebook_name: '',
  accounting_problem: '',
  channel: '',
}

export function BhcDrawer({ open, onClose, editing }: BhcDrawerProps) {
  const createBhc = useCreateBhc()
  const updateBhc = useUpdateBhc()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          full_name: editing.full_name,
          nickname: editing.nickname,
          phone: editing.phone,
          facebook_name: editing.facebook_name,
          accounting_problem: editing.accounting_problem,
          channel: editing.channel,
        })
      } else {
        setForm(emptyForm)
      }
      setError('')
    }
  }, [open, editing])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const loading = createBhc.isPending || updateBhc.isPending

  const handleSubmit = async () => {
    setError('')
    if (!form.full_name || !form.nickname || !form.phone) {
      setError('กรุณากรอกชื่อ ชื่อเล่น และเบอร์โทร')
      return
    }

    try {
      if (editing) {
        const promise = updateBhc.mutateAsync({ id: editing.id, ...form })
        notify.promise(promise, {
          loading: 'กำลังบันทึก...',
          success: 'อัพเดทเรียบร้อย',
          error: 'ไม่สามารถบันทึกได้',
        })
        await promise
      } else {
        const promise = createBhc.mutateAsync({
          ...form,
          course_accept: 'ยอมรับ',
          copyright_accept: 'ยอมรับ',
        })
        notify.promise(promise, {
          loading: 'กำลังเพิ่ม...',
          success: 'เพิ่มผู้ลงทะเบียนเรียบร้อย',
          error: 'ไม่สามารถเพิ่มได้',
        })
        await promise
      }
      onClose()
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={editing ? 'แก้ไขผู้ลงทะเบียน BHC' : 'เพิ่มผู้ลงทะเบียน BHC'}>
      <div className="flex flex-col gap-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ชื่อ - นามสกุล *">
            <input className={inputCls} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="ชื่อ นามสกุล" />
          </FormField>
          <FormField label="ชื่อเล่น *">
            <input className={inputCls} value={form.nickname} onChange={e => set('nickname', e.target.value)} placeholder="ชื่อเล่น" />
          </FormField>
        </div>

        <FormField label="เบอร์โทร *">
          <input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
        </FormField>

        <FormField label="ชื่อ Facebook">
          <input className={inputCls} value={form.facebook_name} onChange={e => set('facebook_name', e.target.value)} placeholder="ชื่อ Facebook" />
        </FormField>

        <FormField label="ช่องทางที่รู้จัก">
          <select className={inputCls} value={form.channel} onChange={e => set('channel', e.target.value)}>
            <option value="">เลือกช่องทาง</option>
            <option value="Facebook">Facebook</option>
            <option value="Tiktok">TikTok</option>
            <option value="Line">LINE</option>
            <option value="Youtube">YouTube</option>
            <option value="Instagram">Instagram</option>
          </select>
        </FormField>

        <FormField label="ปัญหาที่พบเจอเกี่ยวกับบัญชี">
          <textarea className={textareaCls} rows={3} value={form.accounting_problem} onChange={e => set('accounting_problem', e.target.value)} placeholder="ปัญหาด้านบัญชี การเงิน ภาษี..." />
        </FormField>

        {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

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
            className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'กำลังบันทึก...' : editing ? 'บันทึก' : 'เพิ่มผู้ลงทะเบียน'}
          </button>
        </div>
      </div>
    </Drawer>
  )
}
