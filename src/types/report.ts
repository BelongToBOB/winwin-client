export type ReportType =
  | 'registration_summary'
  | 'attendance_sheet'
  | 'buc_summary'

export type ReportRow = Record<string, string | null | undefined>
