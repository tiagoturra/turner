import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '../modules/tuner/pages/LandingPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
