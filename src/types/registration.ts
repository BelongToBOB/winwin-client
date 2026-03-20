export interface Registration {
  id: string
  registrant_id: string
  first_name: string
  last_name: string
  nickname: string
  email: string
  phone: string
  job_category: string
  channels: string
  loan_amount_range: string
  loan_before: boolean
  credit_banks: string
  objective: string
  loan_problems: string
  reg_status: 'pending' | 'confirmed' | 'attended' | 'cancelled' | 'no_show'
  registered_at: string
  seminar_id: string
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
  course_type: string
  event_date: string
  venue: string
  delivery_mode: string
  max_seats: number
  price: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  total_registrations: number
}
