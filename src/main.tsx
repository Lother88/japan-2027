import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App'
// TEMPORAL · editor del abanico (borrar junto con FanEditor.tsx al terminar)
import FanEditor from '@/features/landing/FanEditor'

const isFanEditor = typeof location !== 'undefined' && location.hash === '#fan-editor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isFanEditor ? <FanEditor /> : <App />}
  </StrictMode>,
)
