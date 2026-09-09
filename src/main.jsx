import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bundle Plus Jakarta Sans (latin + latin-ext) so the app renders correctly
// offline — inside the iOS app and on a cold load with no network. Non-Latin
// UI languages fall back to the system face, same as before.
import '@fontsource/plus-jakarta-sans/latin-400.css'
import '@fontsource/plus-jakarta-sans/latin-500.css'
import '@fontsource/plus-jakarta-sans/latin-600.css'
import '@fontsource/plus-jakarta-sans/latin-700.css'
import '@fontsource/plus-jakarta-sans/latin-800.css'
import '@fontsource/plus-jakarta-sans/latin-ext-400.css'
import '@fontsource/plus-jakarta-sans/latin-ext-500.css'
import '@fontsource/plus-jakarta-sans/latin-ext-600.css'
import '@fontsource/plus-jakarta-sans/latin-ext-700.css'
import '@fontsource/plus-jakarta-sans/latin-ext-800.css'

import LifeInTheUK from './LifeInTheUK.jsx'
import AuthGate from './auth/AuthGate.jsx'
import './native.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthGate>
      <LifeInTheUK />
    </AuthGate>
  </StrictMode>,
)
