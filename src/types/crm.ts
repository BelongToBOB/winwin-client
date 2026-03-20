export type CrmStageValue =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'proposal'
  | 'closed_won'
  | 'closed_lost'

export interface CrmStage {
  stage: CrmStageValue
  count: number
}

export interface Followup {
  id: string
  first_name: string
  last_name: string
  crm_stage: CrmStageValue
  assigned_to: string
  last_contacted: string
  next_followup: string
  channel: string
  seminar_id: string
  notes: string
}
