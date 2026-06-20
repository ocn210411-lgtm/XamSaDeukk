// Cloud storage via JSONBin.io
const MASTER_KEY = import.meta.env.VITE_JSONBIN_KEY
const BIN_ID = import.meta.env.VITE_JSONBIN_ID
const BASE = 'https://api.jsonbin.io/v3'

// Compresser une image base64 avant stockage cloud
export function compressImage(base64, maxW = 900, quality = 0.75) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width, h = img.height
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = base64
  })
}

// Lire les puzzles depuis le cloud
export async function fetchPuzzles() {
  if (!MASTER_KEY || !BIN_ID) return null
  try {
    const res = await fetch(`${BASE}/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': MASTER_KEY }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.record?.puzzles || []
  } catch { return null }
}

// Sauvegarder les puzzles dans le cloud
export async function savePuzzles(puzzles) {
  if (!MASTER_KEY || !BIN_ID) return false
  try {
    const res = await fetch(`${BASE}/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: JSON.stringify({ puzzles })
    })
    return res.ok
  } catch { return false }
}

// Créer un nouveau bin (premier lancement)
export async function createBin() {
  if (!MASTER_KEY) return null
  try {
    const res = await fetch(`${BASE}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
        'X-Bin-Name': 'XamSaDeukk-Puzzles',
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify({ puzzles: [] })
    })
    const data = await res.json()
    return data.metadata?.id || null
  } catch { return null }
}

export const cloudEnabled = !!(MASTER_KEY && BIN_ID)
