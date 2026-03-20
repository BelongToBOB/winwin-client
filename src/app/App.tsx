import { Routes, Route, Navigate } from 'react-router'
import { Shell } from '@/components/layout/Shell'
import { OverviewPage } from '@/pages/overview/OverviewPage'
import { RegistrationsPage } from '@/pages/registrations/RegistrationsPage'
import { CrmPage } from '@/pages/crm/CrmPage'
import { ReportPage } from '@/pages/report/ReportPage'
import { SeminarsPage } from '@/pages/seminars/SeminarsPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="seminars" element={<SeminarsPage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="report" element={<ReportPage />} />
      </Route>
    </Routes>
  )
}

export default App
