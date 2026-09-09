import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LifeInTheUK from './LifeInTheUK.jsx'
import AuthGate from './auth/AuthGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthGate>
      <LifeInTheUK />
    </AuthGate>
  </StrictMode>,
)
