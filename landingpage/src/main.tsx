import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/features/employee/styles/index.css'
import '@/features/pm/styles/index.css'
import '@/features/leadership/styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
