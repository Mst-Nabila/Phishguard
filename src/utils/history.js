export const HISTORY_KEY = 'phishguard.history'
const MAX_ITEMS = 200

// Reads saved scans from this browser. Never throws.
export function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeHistory(items) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}

// Saves a scan result at the top of the history (newest first).
export function saveScan(result) {
  const items = loadHistory().filter((item) => item?.id !== result.id)
  items.unshift(result)
  return writeHistory(items.slice(0, MAX_ITEMS))
}

export function getScan(id) {
  return loadHistory().find((item) => item?.id === id) || null
}

export function clearHistory() {
  return writeHistory([])
}

// Counts scans by risk band: 0-29 low, 30-69 suspicious, 70-100 high.
export function summarizeHistory(history) {
  const summary = { total: history.length, low: 0, suspicious: 0, high: 0 }
  for (const item of history) {
    const score = Number(item?.score)
    if (!Number.isFinite(score)) continue
    if (score >= 70) summary.high += 1
    else if (score >= 30) summary.suspicious += 1
    else summary.low += 1
  }
  return summary
}
