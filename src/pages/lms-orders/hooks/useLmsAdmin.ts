import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lmsApi } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export interface LmsStats {
  total: number
  paid: number
  active: number
  failed: number
  pending: number
}

export interface LmsRegistration {
  id: string
  customerCode: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  lineId: string | null
  status: string
  enrolledAt: string | null
  enrollmentError: string | null
  welcomeEmailSentAt: string | null
  createdAt: string
  course: { title: string; slug: string }
  orders: { orderNo: string; status: string; channelCode: string; amount: string; paidAt: string | null; manualReview: boolean; slipVerified: boolean; slipTransactionId: string | null }[]
  survey: {
    source: string[]
    skillLevel: string | null
    goal: string[]
    interestedTopics: string | null
    needsReceipt: boolean
    receiptType: string | null
    receiptName: string | null
    receiptAddress: string | null
    receiptTaxId: string | null
    receiptEmail: string | null
    needsWithholding: boolean
    withholdingContact: string | null
    withholdingAcknowledged: boolean
    createdAt: string
  } | null
}

export function useLmsStats() {
  return useQuery({
    queryKey: qk.lmsStats(),
    queryFn: () => lmsApi.get<LmsStats>('/admin/stats').then(r => r.data),
  })
}

export function useLmsRegistrations() {
  return useQuery({
    queryKey: qk.lmsRegs(),
    queryFn: () => lmsApi.get<LmsRegistration[]>('/admin/registrations').then(r => r.data),
  })
}

export function useRetryEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lmsApi.post(`/admin/registrations/${id}/retry-enrollment`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lms'] })
    },
  })
}

export function useApproveSlip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lmsApi.post(`/admin/registrations/${id}/approve-slip`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lms'] }),
  })
}

export function useRetryEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lmsApi.post(`/admin/registrations/${id}/retry-email`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lms'] })
    },
  })
}
