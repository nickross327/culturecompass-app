// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// your Base44 client with appId/apiKey/apiUrl
import base44 from './api/base44Client'

// ⬇️ one of these will exist in @base44/sdk.
// Try AuthProvider first; if your SDK exports Base44Provider instead,
// swap the import and the component name.
import { AuthProvider } from '@base44/sdk'
// import { Base44Provider as AuthProvider } from '@base44/sdk'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider client={base44}>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
