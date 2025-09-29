// src/api/base44Client.js
import { createClient } from '@base44/sdk'

// TODO: replace these three with the real values from your Base44 project settings
const PROJECT_ID = 'YOUR_PROJECT_ID'
const API_URL    = 'YOUR_API_URL'        // e.g. https://api.base44.ai (check your dashboard)
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'     // if your project uses a public key, paste it here

export const base44 = createClient({
  projectId: PROJECT_ID,
  apiUrl: API_URL,
  publicKey: PUBLIC_KEY,   // if your project doesn’t need this, you can remove this line
})
