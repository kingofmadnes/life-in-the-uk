import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LifeInTheUK from './LifeInTheUK.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LifeInTheUK />
  </StrictMode>,
)
