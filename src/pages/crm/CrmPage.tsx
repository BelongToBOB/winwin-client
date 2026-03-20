import { useState } from 'react'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { useCrmStages, useCrmFollowups } from './hooks/useCrm'
import { StageBoard } from './components/StageBoard'
import { FollowupTable } from './components/FollowupTable'
import { ContactDrawer } from './components/ContactDrawer'
import type { Followup } from '@/types/crm'

export function CrmPage() {
  const { filters, setFilter } = useUrlFilters({ seminar_id: '', overdue_only: 'false' })
  const isOverdueOnly = filters.overdue_only === 'true'

  const { data: stagesData, isLoading: isLoadingStages } = useCrmStages()
  const { data: followupsData, isLoading: isLoadingFollowups } = useCrmFollowups({
    seminar_id: filters.seminar_id,
    overdue_only: isOverdueOnly
  })

  const [selectedContact, setSelectedContact] = useState<Followup | null>(null)

  return (
    <div className="flex flex-col h-full gap-4">
      <StageBoard stages={stagesData} isLoading={isLoadingStages} />
      
      <FollowupTable 
        data={followupsData} 
        isLoading={isLoadingFollowups}
        overdueOnly={isOverdueOnly}
        onToggleOverdue={(val) => setFilter('overdue_only', String(val))}
        onRowClick={setSelectedContact}
      />

      <ContactDrawer
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        data={selectedContact}
        overdueOnly={isOverdueOnly}
      />
    </div>
  )
}
