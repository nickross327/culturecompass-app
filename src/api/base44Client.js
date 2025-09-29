// src/api/base44Client.js
import { createClient } from '@base44/sdk'

// ⬇️ use YOUR values
const APP_ID  = '68a0a8c371c89cb4ee1d424e'            // ← the id in your URL
const API_KEY = '63f6da01524b4bea9c0e346501651707'     // ← public/client key (not secret!)
const API_URL = 'https://app.base44.com/api/apps/68a0a8c371c89cb4ee1d424e'           // try this first

let client = null
try {
  client = createClient({
    appId: APP_ID,          // IMPORTANT: appId (not projectId)
    apiKey: API_KEY,        // IMPORTANT: apiKey (not publicKey)
    apiUrl: API_URL
  })
} catch (e) {
  console.error('Base44 client init failed:', e)
  client = null
}

export { client as base44 }
export default client
