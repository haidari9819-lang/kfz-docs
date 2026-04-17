import { readFileSync, existsSync } from 'fs'
import { createRequire } from 'module'

// .env.local manuell laden
const envPath = '.env.local'
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  })
}

const XAI_API_KEY = process.env.XAI_API_KEY
if (!XAI_API_KEY) { console.error('❌ XAI_API_KEY fehlt in .env.local'); process.exit(1) }
console.log('✓ XAI_API_KEY gefunden:', XAI_API_KEY.substring(0, 12) + '...')

// Test-Bild bestimmen
let imageBase64, mimeType

if (existsSync('test-dokument.jpg')) {
  imageBase64 = readFileSync('test-dokument.jpg').toString('base64')
  mimeType = 'image/jpeg'
  console.log('✓ test-dokument.jpg geladen')
} else if (existsSync('test-dokument.png')) {
  imageBase64 = readFileSync('test-dokument.png').toString('base64')
  mimeType = 'image/png'
  console.log('✓ test-dokument.png geladen')
} else {
  // 1×1 weißes PNG als Dummy
  imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII='
  mimeType = 'image/png'
  console.log('⚠ Kein test-dokument.jpg gefunden — verwende 1×1 Dummy-Bild')
}

// Grok Vision direkt aufrufen
console.log('\n⏳ Rufe Grok Vision API auf (grok-2-vision-latest)...')
const res = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${XAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'grok-2-vision-latest',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        { type: 'text', text: 'Was siehst du auf diesem Bild? Antworte kurz auf Deutsch.' }
      ]
    }],
    max_tokens: 200,
  })
})

const body = await res.json()

if (!res.ok) {
  console.error('❌ API-Fehler:', res.status, JSON.stringify(body, null, 2))
  process.exit(1)
}

const antwort = body.choices?.[0]?.message?.content
console.log('\n✅ Grok Vision antwortet:')
console.log(antwort)
console.log('\n📊 Token-Verbrauch:', body.usage)
