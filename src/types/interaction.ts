export interface Interaction {
  id: string
  contact_id: string
  channel: string
  direction: 'inbound' | 'outbound'
  content: string
  outcome: string
  created_by: string
  interacted_at: string
}
