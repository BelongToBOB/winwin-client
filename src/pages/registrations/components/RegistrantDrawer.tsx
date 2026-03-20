import { Drawer } from '@/components/ui/Drawer'
import type { Registration } from '@/types/registration'
import { getInitials } from '@/lib/utils'

interface RegistrantDrawerProps {
  open: boolean
  onClose: () => void
  data: Registration | null
}

export function RegistrantDrawer({ open, onClose, data }: RegistrantDrawerProps) {
  if (!data) return null

  return (
    <Drawer open={open} onClose={onClose} title="รายละเอียดผู้ลงทะเบียน">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-[15px] font-semibold shrink-0">
            {getInitials(data.first_name, data.last_name)}
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-black dark:text-white tracking-tight">
              {data.first_name} {data.last_name} {data.nickname && `(${data.nickname})`}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/60 dark:bg-white/[0.08] dark:text-white/60 mt-1">
              {data.job_category}
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-black/[0.08] dark:bg-white/[0.08]" />

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
            <div className="text-black/40 dark:text-white/40 mb-1">Channel</div>
            <div className="text-black/80 dark:text-white/80">{data.channels || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Loan range</div>
            <div className="text-black/80 dark:text-white/80">{data.loan_amount_range || '-'}</div>
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">เคยกู้</div>
            {data.loan_before ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#FF9500]/12 text-[#FF9500]">เคย</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-black/[0.06] text-black/40 dark:bg-white/[0.06] dark:text-white/40">ไม่เคย</span>
            )}
          </div>
          <div>
            <div className="text-black/40 dark:text-white/40 mb-1">Credit banks</div>
            <div className="text-black/80 dark:text-white/80">{data.credit_banks || '-'}</div>
          </div>
        </div>

        <div>
          <div className="text-[13px] text-black/40 dark:text-white/40 mb-1.5">วัตถุประสงค์</div>
          <textarea
            readOnly
            value={data.objective || '-'}
            className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none"
            rows={3}
          />
        </div>

        <div>
          <div className="text-[13px] text-black/40 dark:text-white/40 mb-1.5">ปัญหาการกู้</div>
          <textarea
            readOnly
            value={data.loan_problems || '-'}
            className="w-full text-[13px] p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-0 text-black/80 dark:text-white/80 resize-none focus:outline-none"
            rows={3}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/15 active:scale-[0.97] transition-all duration-150">
            ดู CRM →
          </button>
        </div>
      </div>
    </Drawer>
  )
}
