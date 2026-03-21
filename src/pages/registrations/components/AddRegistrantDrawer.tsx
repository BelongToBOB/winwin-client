import { useState } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useCreateRegistrant, useCreateRegistration } from '../hooks/useRegistrationMutations'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'

interface AddRegistrantDrawerProps {
  open: boolean
  onClose: () => void
  seminarId: string
  filters: Record<string, string>
}

export function AddRegistrantDrawer({ open, onClose, seminarId, filters }: AddRegistrantDrawerProps) {
  const createRegistrant = useCreateRegistrant()
  const createRegistration = useCreateRegistration(filters)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    phone: '',
    job_category: '',
  })
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const loading = createRegistrant.isPending || createRegistration.isPending

  const handleSubmit = async () => {
    setError('')
    if (!form.first_name || !form.last_name) {
      setError('กรุณากรอกชื่อและนามสกุล')
      return
    }
    if (!seminarId) {
      setError('กรุณาเลือก Seminar ก่อน (ใช้ filter seminar_id)')
      return
    }
    let registrantId: string | null = null
    try {
      const registrantRows = await createRegistrant.mutateAsync({
        first_name: form.first_name,
        last_name: form.last_name,
        nickname: form.nickname || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        job_category: form.job_category || undefined,
      })
      const registrant = Array.isArray(registrantRows) ? registrantRows[0] : registrantRows
      registrantId = registrant.id
    } catch {
      setError('ไม่สามารถสร้างผู้ลงทะเบียนได้ กรุณาลองใหม่')
      return
    }
    try {
      await createRegistration.mutateAsync({ registrant_id: registrantId!, seminar_id: seminarId })
      setForm({ first_name: '', last_name: '', nickname: '', email: '', phone: '', job_category: '' })
      onClose()
    } catch {
      setError('สร้างผู้ลงทะเบียนสำเร็จ แต่ไม่สามารถลงทะเบียน seminar ได้ กรุณาติดต่อ admin')
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="เพิ่มผู้ลงทะเบียน">
      <div className="flex flex-col gap-4 py-2">
        {seminarId && (
          <div className="px-3 py-2 rounded-xl bg-[#007AFF]/8 text-[12px] text-[#007AFF]">
            Seminar: <span className="font-medium">{seminarId}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="ชื่อ *">
            <input className={inputCls} value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="สมชาย" />
          </FormField>
          <FormField label="นามสกุล *">
            <input className={inputCls} value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="ใจดี" />
          </FormField>
        </div>

        <FormField label="ชื่อเล่น">
          <input className={inputCls} value={form.nickname} onChange={e => set('nickname', e.target.value)} placeholder="โจ" />
        </FormField>

        <FormField label="Email">
          <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
        </FormField>

        <FormField label="เบอร์โทร">
          <input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
        </FormField>

        <FormField label="อาชีพ">
          <input className={inputCls} value={form.job_category} onChange={e => set('job_category', e.target.value)} placeholder="พนักงานบริษัท" />
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
            className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#34C759] hover:bg-[#34C759]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'กำลังบันทึก…' : 'เพิ่มผู้ลงทะเบียน'}
          </button>
        </div>
      </div>
    </Drawer>
  )
}
