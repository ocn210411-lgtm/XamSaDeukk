// Cloud storage via JSONBin.io — puzzles + encyclopédie
const MASTER_KEY = import.meta.env.VITE_JSONBIN_KEY
const BIN_ID = import.meta.env.VITE_JSONBIN_ID
const BASE = 'https://api.jsonbin.io/v3'

export const cloudEnabled = !!(MASTER_KEY && BIN_ID)

// ─── Compression image ────────────────────────────────────────────────────────
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

// ─── Lecture complète du bin ──────────────────────────────────────────────────
async function fetchBin() {
  if (!cloudEnabled) return null
  try {
    const res = await fetch(`${BASE}/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': MASTER_KEY }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.record || {}
  } catch { return null }
}

// ─── Écriture complète du bin ─────────────────────────────────────────────────
async function saveBin(record) {
  if (!cloudEnabled) return false
  try {
    const res = await fetch(`${BASE}/b/${BIN_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
      body: JSON.stringify(record)
    })
    return res.ok
  } catch { return false }
}

// ─── PUZZLES ──────────────────────────────────────────────────────────────────
export async function fetchPuzzles() {
  const record = await fetchBin()
  return record?.puzzles || []
}

export async function savePuzzles(puzzles) {
  const record = (await fetchBin()) || {}
  return saveBin({ ...record, puzzles })
}

// ─── ENCYCLOPÉDIE ─────────────────────────────────────────────────────────────
export async function fetchEncyclopedie() {
  const record = await fetchBin()
  return record?.encyclopedie || null  // null = pas encore dans le cloud
}

export async function saveEncyclopedie(encyclopedie) {
  const record = (await fetchBin()) || {}
  return saveBin({ ...record, encyclopedie })
}
