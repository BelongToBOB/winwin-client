import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { DeleteConfirm } from '@/components/ui/DeleteConfirm'
import {
  useUpdateRegistrationStatus,
  useUpdateRegistrationProfile,
  useDeleteRegistration,
} from '../hooks/useRegistrationMutations'
import { getInitials } from '@/lib/utils'
import type { Registration } from '@/types/registration'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'
const textareaCls = 'w-full px-3 py-2 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 resize-none'

interface RegistrantDrawerProps {
  open: boolean
  onClose: () => void
  data: Registration | null
  filters: Record<string, string>
}

export function RegistrantDrawer({ open, onClose, data, filters }: RegistrantDrawerProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateStatus = useUpdateRegistrationStatus(filters)
  const updateProfile = useUpdateRegistrationProfile(filters)
  const deleteReg = useDeleteRegistration(filters)

  const [form, setForm] = useState({
    reg_status: data?.reg_status ?? 'pending',
    loan_amount_range: data?.loan_amount_range ?? '',
    loan_before: data?.loan_before ?? false,
    credit_banks: data?.credit_banks ?? '',
    channels: data?.channels ?? '',
    objective: data?.objective ?? '',
    loan_problems: data?.loan_problems ?? '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        reg_status: data.reg_status,
        loan_amount_range: data.loan_amount_range ?? '',
        loan_before: data.loan_before ?? false,
        credit_banks: data.credit_banks ?? '',
        channels: data.channels ?? '',
        objective: data.objective ?? '',
        loan_problems: data.loan_problems ?? '',
      })
      setEditing(false)
      setConfirmDelete(false)
    }
  }, [data])

  if (!data) return null

  const [saveError, setSaveError] = useState<string | null>(null)
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))
  const loading = updateStatus.isPending || updateProfile.isPending

  const handleSave = async () => {
    setSaveError(null)
    try {
      await updateStatus.mutateAsync({ id: data.id, reg_status: form.reg_status })
      await updateProfile.mutateAsync({
        registrationId: data.id,
        loan_amount_range: form.loan_amount_range || undefined,
        loan_before: form.loan_before,
        credit_banks: form.credit_banks || undefined,
        channels: form.channels || undefined,
        objective: form.objective || undefined,
        loan_problems: form.loan_problems || undefined,
      })
      setEditing(false)
    } catch {
      setSaveError('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่')
    }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':   return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/50 dark:bg-white/[0.08] dark:text-white/50">PENDING</span>
      case 'confirmed': return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#007AFF]/10 text-[#007AFF]">CONFIRMED</span>
      case 'attended':  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34C759]/12 text-[#34C759]">ATTENDED</span>
      case 'no_show':   return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF3B30]/10 text-[#FF3B30]">NO SHOW</span>
      case 'cancelled': return <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/30 dark:bg-white/[0.06] dark:text-white/30">CANCELLED</span>
      default: return null
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="รายละเอียดผู้ลงทะเบียน">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-[15px] font-semibold shrink-0">
              {getInitials(data.first_name, data.last_name)}
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                {data.first_name} {data.last_name} {data.nickname && `(${data.nickname})`}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                {renderStatusBadge(data.reg_status)}
                <span className="text-[11px] text-black/40 dark:text-white/40">{data.job_category}</span>
              </div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="h-7 px-3 rounded-lg text-[12px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
            >
              แก้ไข
            </button>
          )}
        </div>

        <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

        {/* Contact info */}
        <div className="grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Email</div>
            <div className="text-black/80 dark:text-white/80">{data.email || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Phone</div>
            <div className="text-black/80 dark:text-white/80">{data.phone || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Seminar</div>
            <div className="text-black/80 dark:text-white/80 font-mono text-[12px]">{data.seminar_id || '-'}</div>
          </div>
        </div>

        <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

        {/* Editable section */}
        {editing ? (
          <div className="flex flex-col gap-4">
            <FormField label="สถานะ">
              <select className={inputCls} value={form.reg_status} onChange={e => set('reg_status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="attended">Attended</option>
                <option value="no_show">No Show</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Loan range">
                <select className={inputCls} value={form.loan_amount_range} onChange={e => set('loan_amount_range', e.target.value)}>
                  <option value="">ไม่ระบุ</option>
                  <option value="< 100k">&lt; 100k</option>
                  <option value="100k-500k">100k–500k</option>
                  <option value="500k-1M">500k–1M</option>
                  <option value="1M-3M">1M–3M</option>
                  <option value="> 3M">&gt; 3M</option>
                </select>
              </FormField>
              <FormField label="เคยกู้">
                <select className={inputCls} value={form.loan_before ? 'true' : 'false'} onChange={e => set('loan_before', e.target.value === 'true')}>
                  <option value="false">ไม่เคย</option>
                  <option value="true">เคย</option>
                </select>
              </FormField>
            </div>

            <FormField label="Channel">
              <input className={inputCls} value={form.channels} onChange={e => set('channels', e.target.value)} placeholder="Facebook, Line..." />
            </FormField>

            <FormField label="Credit banks">
              <input className={inputCls} value={form.credit_banks} onChange={e => set('credit_banks', e.target.value)} placeholder="SCB, KBank..." />
            </FormField>

            <FormField label="วัตถุประสงค์">
              <textarea className={textareaCls} rows={3} value={form.objective} onChange={e => set('objective', e.target.value)} />
            </FormField>

            <FormField label="ปัญหาการกู้">
              <textarea className={textareaCls} rows={3} value={form.loan_problems} onChange={e => set('loan_problems', e.target.value)} />
            </FormField>

            <div className="flex justify-between gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div>
                {confirmDelete ? (
                  <DeleteConfirm
                    onConfirm={() => deleteReg.mutate(data.id, { onSuccess: () => { setConfirmDelete(false); onClose() } })}
                    onCancel={() => setConfirmDelete(false)}
                    loading={deleteReg.isPending}
                  />
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="h-8 px-3 rounded-xl text-[12px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 transition-colors"
                  >
                    ลบ
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="h-8 px-3 rounded-xl text-[12px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="h-8 px-4 rounded-xl text-[12px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'กำลังบันทึก…' : 'บันทึก'}
                </button>
              </div>
            </div>
            {saveError && (
              <p className="text-[12px] text-[#FF3B30] text-right mt-1">{saveError}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-[13px]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Channel</div>
                <div className="text-black/80 dark:text-white/80">{data.channels || '-'}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Loan range</div>
                <div className="text-black/80 dark:text-white/80">{data.loan_amount_range || '-'}</div>
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">เคยกู้</div>
                {data.loan_before
                  ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FF9500]/12 text-[#FF9500]">เคย</span>
                  : <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ไม่เคย</span>
                }
              </div>
              <div>
                <div className="text-black/40 dark:text-white/40 mb-1">Credit banks</div>
                <div className="text-black/80 dark:text-white/80">{data.credit_banks || '-'}</div>
              </div>
            </div>

            <div>
              <div className="text-black/40 dark:text-white/40 mb-1.5">วัตถุประสงค์</div>
              <textarea readOnly value={data.objective || '-'} rows={3}
                className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none" />
            </div>

            <div>
              <div className="text-black/40 dark:text-white/40 mb-1.5">ปัญหาการกู้</div>
              <textarea readOnly value={data.loan_problems || '-'} rows={3}
                className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none" />
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}
