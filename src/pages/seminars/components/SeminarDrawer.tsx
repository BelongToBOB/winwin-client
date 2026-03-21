import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { useCreateSeminar, useUpdateSeminar } from '../hooks/useSeminars'
import type { CourseEvent } from '@/types/registration'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'

interface SeminarDrawerProps {
  open: boolean
  onClose: () => void
  event?: CourseEvent | null
}

export function SeminarDrawer({ open, onClose, event }: SeminarDrawerProps) {
  const isEdit = !!event
  const create = useCreateSeminar()
  const update = useUpdateSeminar()

  const [form, setForm] = useState({
    seminar_id: event?.seminar_id ?? '',
    course_name: event?.course_name ?? '',
    course_type: event?.course_type ?? '',
    event_date: event?.event_date?.slice(0, 10) ?? '',
    venue: event?.venue ?? '',
    delivery_mode: event?.delivery_mode ?? '',
    max_seats: event?.max_seats?.toString() ?? '',
    price: event?.price?.toString() ?? '',
    status: event?.status ?? 'upcoming',
  })

  useEffect(() => {
    if (event) {
      setForm({
        seminar_id: event.seminar_id,
        course_name: event.course_name,
        course_type: event.course_type ?? '',
        event_date: event.event_date?.slice(0, 10) ?? '',
        venue: event.venue ?? '',
        delivery_mode: event.delivery_mode ?? '',
        max_seats: event.max_seats?.toString() ?? '',
        price: event.price?.toString() ?? '',
        status: event.status ?? 'upcoming',
      })
    } else {
      setForm({
        seminar_id: '', course_name: '', course_type: '',
        event_date: '', venue: '', delivery_mode: '',
        max_seats: '', price: '', status: 'upcoming',
      })
    }
  }, [event])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const loading = create.isPending || update.isPending

  const handleSubmit = () => {
    const payload = {
      ...form,
      max_seats: form.max_seats ? Number(form.max_seats) : undefined,
      price: form.price ? Number(form.price) : undefined,
    }
    if (isEdit) {
      update.mutate({ id: event.id, ...payload }, { onSuccess: onClose })
    } else {
      create.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? 'แก้ไข Seminar' : 'เพิ่ม Seminar'}>
      <div className="flex flex-col gap-4 py-2">
        <FormField label="Seminar ID">
          <input
            className={inputCls}
            value={form.seminar_id}
            onChange={e => set('seminar_id', e.target.value)}
            placeholder="e.g. SEM-2026-01"
            disabled={isEdit}
          />
        </FormField>

        <FormField label="ชื่อคอร์ส">
          <input
            className={inputCls}
            value={form.course_name}
            onChange={e => set('course_name', e.target.value)}
            placeholder="ชื่อ Seminar"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="ประเภทคอร์ส">
            <input
              className={inputCls}
              value={form.course_type}
              onChange={e => set('course_type', e.target.value)}
              placeholder="เช่น Wealth Planning"
            />
          </FormField>
          <FormField label="วันที่จัดงาน">
            <input
              type="date"
              className={inputCls}
              value={form.event_date}
              onChange={e => set('event_date', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="สถานที่">
          <input
            className={inputCls}
            value={form.venue}
            onChange={e => set('venue', e.target.value)}
            placeholder="เช่น โรงแรม Centara"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="รูปแบบ">
            <select className={inputCls} value={form.delivery_mode} onChange={e => set('delivery_mode', e.target.value)}>
              <option value="">เลือก...</option>
              <option value="onsite">Onsite</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </FormField>
          <FormField label="สถานะ">
            <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="ที่นั่งสูงสุด">
            <input
              type="number"
              className={inputCls}
              value={form.max_seats}
              onChange={e => set('max_seats', e.target.value)}
              placeholder="50"
            />
          </FormField>
          <FormField label="ราคา (บาท)">
            <input
              type="number"
              className={inputCls}
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="0"
            />
          </FormField>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-[13px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.seminar_id || !form.course_name}
            className="h-9 px-5 rounded-xl text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>
        </div>
      </div>
    </Drawer>
  )
}
