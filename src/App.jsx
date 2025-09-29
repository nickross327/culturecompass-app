// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import base44 from './api/base44Client'

// ✅ The Base44 SDK exports Base44Provider (not AuthProvider)
import { Base44Provider } from '@base44/sdk'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Base44Provider client={base44}>
      <App />
    </Base44Provider>
  </React.StrictMode>
)
