export type ReportType =
  | 'registration_summary'
  | 'attendance_sheet'
  | 'loan_profile'
  | 'buc_summary'

export type ReportRow = Record<string, string | null | undefined>
