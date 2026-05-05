import { Routes, Route, Navigate } from 'react-router'
import { Shell } from '@/components/layout/Shell'
import { OverviewPage } from '@/pages/overview/OverviewPage'
import { RegistrationsPage } from '@/pages/registrations/RegistrationsPage'
import { ReportPage } from '@/pages/report/ReportPage'
import { SeminarsPage } from '@/pages/seminars/SeminarsPage'
import { BucPage } from '@/pages/buc/BucPage'
import { BhcPage } from '@/pages/bhc-registrations/BhcPage'
import { LmsOrdersPage } from '@/pages/lms-orders/LmsOrdersPage'
import { PrivateConsultPage } from '@/pages/private-consult/PrivateConsultPage'
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
        <Route path="online-courses/bank-uncensored" element={<BucPage />} />
        <Route path="online-courses/business-health-check" element={<BhcPage />} />
        <Route path="private-consult" element={<PrivateConsultPage />} />
        <Route path="lms-orders" element={<LmsOrdersPage />} />
      </Route>
    </Routes>
    </AuthGate>
  )
}

export default App
