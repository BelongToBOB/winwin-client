export type ReportType =
  | 'registration_summary'
  | 'attendance_sheet'

export type ReportRow = Record<string, string | null | undefined>
