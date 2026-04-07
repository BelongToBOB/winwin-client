export type ReportType =
  | 'registration_summary'
  | 'loan_profile'
  | 'crm_pipeline'
  | 'attendance'

export type ReportRow = Record<string, string | null | undefined>
