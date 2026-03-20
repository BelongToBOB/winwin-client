import { Drawer } from '@/components/ui/Drawer'
import type { Followup } from '@/types/crm'
import { getInitials, formatDate } from '@/lib/utils'
import { renderStageBadge } from './FollowupTable'

interface ContactDrawerProps {
  open: boolean
  onClose: () => void
  data: Followup | null
}

export function ContactDrawer({ open, onClose, data }: ContactDrawerProps) {
  if (!data) return null

  return (
    <Drawer open={open} onClose={onClose} title="รายละเอียดผู้ติดต่อ">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-[15px] font-semibold shrink-0">
            {getInitials(data.first_name, data.last_name)}
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
              {data.first_name} {data.last_name}
            </h3>
            <div className="mt-1">
              {renderStageBadge(data.crm_stage)}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

        <div className="grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Assigned to</div>
            <div className="text-black/80 dark:text-white/80">{data.assigned_to || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Channel</div>
            <div className="text-black/80 dark:text-white/80">{data.channel || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Last contacted</div>
            <div className="text-black/80 dark:text-white/80">{formatDate(data.last_contacted) || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Next follow-up</div>
            <div className="text-black/80 dark:text-white/80">{formatDate(data.next_followup) || '-'}</div>
          </div>
        </div>

        <div>
          <div className="text-[13px] text-black/40 dark:text-white/40 mb-1.5">หมายเหตุ</div>
          <textarea
            readOnly
            value={data.notes || '-'}
            className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none"
            rows={4}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-[13px] font-medium text-black/80 dark:text-white/80 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:scale-[0.97] transition-all duration-150"
          >
            ปิด
          </button>
          <button className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#007AFF] border border-[#007AFF] bg-transparent hover:bg-[#007AFF]/10 active:scale-[0.97] transition-all duration-150">
            บันทึก interaction
          </button>
        </div>
      </div>
    </Drawer>
  )
}
