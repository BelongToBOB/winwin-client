import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { ReportType, ReportRow } from '@/types/report'

export function useReportPreview(seminarId: string, type: ReportType | '') {
  return useQuery({
    queryKey: qk.report(seminarId, type),
    queryFn: async () => {
      if (!seminarId || !type) return []
      const { data } = await api.get<ReportRow[]>('/report/preview', {
        params: { seminar_id: seminarId, type }
      })
      return data
    },
    enabled: !!seminarId && !!type,
    staleTime: 1000 * 60 * 2
  })
}

export function exportReport(seminarId: string, type: ReportType, format: 'csv') {
  if (!seminarId || !type) return
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'
  window.open(`${base}/report/export?seminar_id=${seminarId}&type=${type}&format=${format}`, '_blank')
}
