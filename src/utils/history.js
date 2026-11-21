export const HISTORY_KEY = 'phishguard.history'

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
