import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { LandingPage } from './modules/tuner/pages/LandingPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode><LandingPage /></StrictMode>,
)
