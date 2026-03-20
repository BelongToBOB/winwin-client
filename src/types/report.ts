export type ReportType =
  | 'registration_summary'
  | 'loan_profile'
  | 'crm_pipeline'
  | 'attendance'

export interface ReportRow {
  metric: string
  value: string
}
