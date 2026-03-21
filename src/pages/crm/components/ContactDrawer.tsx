import { useState, useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { FormField } from '@/components/ui/FormField'
import { DeleteConfirm } from '@/components/ui/DeleteConfirm'
import { useUpdateContact } from '../hooks/useCrmMutations'
import { useInteractions, useCreateInteraction, useDeleteInteraction } from '../hooks/useInteractions'
import { getInitials, formatDate } from '@/lib/utils'
import { renderStageBadge } from './FollowupTable'
import type { Followup } from '@/types/crm'

const inputCls = 'w-full h-9 px-3 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30'
const textareaCls = 'w-full px-3 py-2 rounded-xl text-[13px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 resize-none'

interface ContactDrawerProps {
  open: boolean
  onClose: () => void
  data: Followup | null
  overdueOnly: boolean
}

export function ContactDrawer({ open, onClose, data, overdueOnly }: ContactDrawerProps) {
  const [editing, setEditing] = useState(false)
  const [addingInteraction, setAddingInteraction] = useState(false)
  const [deleteInteractionId, setDeleteInteractionId] = useState<string | null>(null)

  const updateContact = useUpdateContact(overdueOnly)
  const { data: interactions } = useInteractions(data?.id)
  const createInteraction = useCreateInteraction(data?.id ?? '')
  const deleteInteraction = useDeleteInteraction(data?.id ?? '')

  const [form, setForm] = useState({
    crm_stage: data?.crm_stage ?? 'new',
    assigned_to: data?.assigned_to ?? '',
    notes: data?.notes ?? '',
    next_followup: data?.next_followup?.slice(0, 10) ?? '',
    last_contacted: data?.last_contacted?.slice(0, 10) ?? '',
  })

  const [interactionForm, setInteractionForm] = useState({
    channel: '',
    direction: 'outbound',
    content: '',
    outcome: '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        crm_stage: data.crm_stage,
        assigned_to: data.assigned_to ?? '',
        notes: data.notes ?? '',
        next_followup: data.next_followup?.slice(0, 10) ?? '',
        last_contacted: data.last_contacted?.slice(0, 10) ?? '',
      })
      setEditing(false)
      setAddingInteraction(false)
    }
  }, [data])

  if (!data) return null

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const setIF = (k: string, v: string) => setInteractionForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    updateContact.mutate({
      id: data.id,
      crm_stage: form.crm_stage,
      assigned_to: form.assigned_to || undefined,
      notes: form.notes || undefined,
      next_followup: form.next_followup || undefined,
      last_contacted: form.last_contacted || undefined,
    }, { onSuccess: () => setEditing(false) })
  }

  const handleAddInteraction = () => {
    createInteraction.mutate({
      contact_id: data.id,
      channel: interactionForm.channel || undefined,
      direction: interactionForm.direction || undefined,
      content: interactionForm.content || undefined,
      outcome: interactionForm.outcome || undefined,
    }, {
      onSuccess: () => {
        setInteractionForm({ channel: '', direction: 'outbound', content: '', outcome: '' })
        setAddingInteraction(false)
      },
    })
  }

  return (
    <Drawer open={open} onClose={onClose} title="รายละเอียดผู้ติดต่อ">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-[15px] font-semibold shrink-0">
              {getInitials(data.first_name, data.last_name)}
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
                {data.first_name} {data.last_name}
              </h3>
              <div className="mt-1">{renderStageBadge(data.crm_stage)}</div>
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

        {/* Edit / View mode */}
        {editing ? (
          <div className="flex flex-col gap-4">
            <FormField label="CRM Stage">
              <select className={inputCls} value={form.crm_stage} onChange={e => set('crm_stage', e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="proposal">Proposal</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </FormField>

            <FormField label="ผู้ดูแล">
              <input className={inputCls} value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)} placeholder="ชื่อ sales" />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="ติดต่อล่าสุด">
                <input type="date" className={inputCls} value={form.last_contacted} onChange={e => set('last_contacted', e.target.value)} />
              </FormField>
              <FormField label="ติดตามครั้งต่อไป">
                <input type="date" className={inputCls} value={form.next_followup} onChange={e => set('next_followup', e.target.value)} />
              </FormField>
            </div>

            <FormField label="หมายเหตุ">
              <textarea className={textareaCls} rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </FormField>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <button
                onClick={() => setEditing(false)}
                className="h-8 px-3 rounded-xl text-[12px] font-medium text-black/60 dark:text-white/60 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={updateContact.isPending}
                className="h-8 px-4 rounded-xl text-[12px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
              >
                {updateContact.isPending ? 'กำลังบันทึก…' : 'บันทึก'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <div className="text-black/40 dark:text-white/40 mb-1">ผู้ดูแล</div>
              <div className="text-black/80 dark:text-white/80">{data.assigned_to || '-'}</div>
            </div>
            <div>
              <div className="text-black/40 dark:text-white/40 mb-1">ช่องทาง</div>
              <div className="text-black/80 dark:text-white/80">{data.channel || '-'}</div>
            </div>
            <div>
              <div className="text-black/40 dark:text-white/40 mb-1">ติดต่อล่าสุด</div>
              <div className="text-black/80 dark:text-white/80">{formatDate(data.last_contacted) || '-'}</div>
            </div>
            <div>
              <div className="text-black/40 dark:text-white/40 mb-1">ติดตามครั้งต่อไป</div>
              <div className="text-black/80 dark:text-white/80">{formatDate(data.next_followup) || '-'}</div>
            </div>
            <div className="col-span-2">
              <div className="text-black/40 dark:text-white/40 mb-1.5">หมายเหตุ</div>
              <textarea readOnly value={data.notes || '-'} rows={3}
                className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none" />
            </div>
          </div>
        )}

        <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

        {/* Interactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-black/70 dark:text-white/70">ประวัติการติดต่อ</span>
            <button
              onClick={() => setAddingInteraction(v => !v)}
              className="h-6 px-2.5 rounded-lg text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 transition-colors"
            >
              {addingInteraction ? 'ยกเลิก' : '+ เพิ่ม'}
            </button>
          </div>

          {addingInteraction && (
            <div className="flex flex-col gap-3 mb-4 p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="ช่องทาง">
                  <input className={inputCls} value={interactionForm.channel} onChange={e => setIF('channel', e.target.value)} placeholder="Line, Call, Email..." />
                </FormField>
                <FormField label="ทิศทาง">
                  <select className={inputCls} value={interactionForm.direction} onChange={e => setIF('direction', e.target.value)}>
                    <option value="outbound">โทรออก/ทักไป</option>
                    <option value="inbound">รับสาย/ทักมา</option>
                  </select>
                </FormField>
              </div>
              <FormField label="เนื้อหา">
                <textarea className={textareaCls} rows={2} value={interactionForm.content} onChange={e => setIF('content', e.target.value)} placeholder="สรุปการติดต่อ..." />
              </FormField>
              <FormField label="ผลลัพธ์">
                <input className={inputCls} value={interactionForm.outcome} onChange={e => setIF('outcome', e.target.value)} placeholder="นัดหมาย, ติดตามต่อ..." />
              </FormField>
              <div className="flex justify-end">
                <button
                  onClick={handleAddInteraction}
                  disabled={createInteraction.isPending}
                  className="h-8 px-4 rounded-xl text-[12px] font-medium text-white bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 transition-colors"
                >
                  {createInteraction.isPending ? 'กำลังบันทึก…' : 'บันทึกประวัติการติดต่อ'}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!interactions || interactions.length === 0 ? (
              <p className="text-[12px] text-black/40 dark:text-white/40 py-2">ยังไม่มีประวัติการติดต่อ</p>
            ) : interactions.map(ix => (
              <div key={ix.id} className="flex items-start gap-3 p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-black/60 dark:text-white/60 uppercase">{ix.channel || '-'}</span>
                    <span className="text-[10px] text-black/30 dark:text-white/30">{ix.direction}</span>
                    <span className="text-[10px] text-black/30 dark:text-white/30 ml-auto tabular-nums">{formatDate(ix.interacted_at)}</span>
                  </div>
                  {ix.content && <p className="text-[12px] text-black/70 dark:text-white/70 truncate">{ix.content}</p>}
                  {ix.outcome && <p className="text-[11px] text-black/40 dark:text-white/40 mt-0.5">{ix.outcome}</p>}
                </div>
                <div onClick={e => e.stopPropagation()}>
                  {deleteInteractionId === ix.id ? (
                    <DeleteConfirm
                      onConfirm={() => deleteInteraction.mutate(ix.id, { onSuccess: () => setDeleteInteractionId(null) })}
                      onCancel={() => setDeleteInteractionId(null)}
                      loading={deleteInteraction.isPending}
                    />
                  ) : (
                    <button
                      onClick={() => setDeleteInteractionId(ix.id)}
                      className="h-6 w-6 rounded-lg flex items-center justify-center text-black/30 dark:text-white/30 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors text-[14px]"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}
