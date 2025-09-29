import { createClient } from '@base44/sdk'

const PROJECT_ID = '68a0a8c371c89cb4ee1d424e'
const API_URL    = 'https://app.base44.com/api'    // try this first
const PUBLIC_KEY = '63f6da01524b4bea9c0e346501651707'  // use PUBLIC key

let client = null
try {
  client = createClient({
    projectId: PROJECT_ID,
    apiUrl: API_URL,
    ...(PUBLIC_KEY ? { publicKey: PUBLIC_KEY } : {}),
  })
} catch (e) {
  console.error('Base44 client init failed:', e)
  client = null
}

export { client as base44 }
export default client
