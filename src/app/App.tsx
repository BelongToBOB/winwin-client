import { Routes, Route, Navigate } from 'react-router'
import { Shell } from '@/components/layout/Shell'
import { OverviewPage } from '@/pages/overview/OverviewPage'
import { RegistrationsPage } from '@/pages/registrations/RegistrationsPage'
import { ReportPage } from '@/pages/report/ReportPage'
import { SeminarsPage } from '@/pages/seminars/SeminarsPage'
import { AuthGate } from '@/components/auth/AuthGate'

export function App() {
  return (
    <AuthGate>
    <Routes>
      <Route path="/" element={<Shell />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="seminars" element={<SeminarsPage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="report" element={<ReportPage />} />
      </Route>
    </Routes>
    </AuthGate>
  )
}

export default App
