// In development, Vite proxies /api to the Express server, so the base is empty.
// In production, set VITE_API_BASE_URL to the deployed backend address.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TIMEOUT_MS = 20000

export class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

// Sends a URL to the backend for analysis.
// Pass an AbortSignal to cancel the request (for example when leaving the page).
export async function scanUrl(url, externalSignal) {
  const controller = new AbortController()
  let timedOut = false

  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, TIMEOUT_MS)

  const onExternalAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', onExternalAbort)

  try {
    const response = await fetch(`${API_BASE}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    })

    let data = null
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new ApiError(data?.message || `The server returned an error (${response.status}).`)
    }
    if (!data || typeof data.id !== 'string') {
      throw new ApiError('The server sent an unexpected response.')
    }
    return data
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error?.name === 'AbortError') {
      if (timedOut) {
        throw new ApiError('The scan took too long and timed out. Please try again.')
      }
      throw error // cancelled by the caller
    }
    throw new ApiError('Could not reach the PhishGuard server. Make sure the backend is running.')
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', onExternalAbort)
  }
}
