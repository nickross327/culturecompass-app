// src/api/base44Client.js
import { createClient } from '@base44/sdk'

// ⬇️ use YOUR values
const APP_ID  = '68a0a8c371c89cb4ee1d424e'            // this is your App ID
const API_KEY = '63f6da01524b4bea9c0e346501651707'     // this is your public API key
const API_URL = 'https://app.base44.com/api'           // keep this as is

let client = null
try {
  client = createClient({
    appId: APP_ID,
    apiKey: API_KEY,
    apiUrl: API_URL,
  })
} catch (e) {
  console.error('Base44 client init failed:', e)
  client = null
}

export { client as base44 }
export default client
