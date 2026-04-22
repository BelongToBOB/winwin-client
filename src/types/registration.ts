export interface Registration {
  id: string
  registrant_id: string
  first_name: string
  last_name: string
  nickname?: string | null
  email?: string | null
  phone?: string | null
  job_category?: string | null
  channels?: string | null
  loan_amount_range?: string | null
  loan_before?: boolean | null
  credit_banks?: string | null
  objective?: string | null
  loan_problems?: string | null
  reg_status: 'pending' | 'confirmed' | 'attended' | 'cancelled' | 'no_show'
  registered_at: string
  seminar_id: string
  reschedule_status: 'none' | 'requested' | 'confirmed' | 'cancelled'
  reschedule_note?: string | null
  reschedule_updated_at?: string | null
}

export interface OverviewData {
  total_registrations: number
  attended: number
  attendance_rate: number
  loan_before_pct: number
  crm_active: number
  crm_overdue: number
  channels: { name: string; count: number }[]
  loan_ranges: { range: string; count: number }[]
  seminars: SeminarSummary[]
}

export interface SeminarSummary {
  seminar_id: string
  course_name: string
  event_date: string
  total: number
  attended: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

export interface CourseEvent {
  id: string
  seminar_id: string
  course_name: string
  course_type?: string | null
  event_date?: string | null
  venue?: string | null
  delivery_mode?: string | null
  max_seats?: number | null
  price?: number | null
  currency?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  total_registrations: number
}
