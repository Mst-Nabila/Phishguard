const MAX_URL_LENGTH = 2048

// Validates and normalises user input into a full http(s) URL.
// Returns { url } on success or { error } with a friendly message.
export function normalizeUrl(input) {
  const trimmed = String(input ?? '').trim()

  if (!trimmed) {
    return { error: 'Please enter a URL to scan.' }
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    return { error: `That URL is too long (maximum ${MAX_URL_LENGTH} characters).` }
  }
  if (/\s/.test(trimmed)) {
    return { error: 'A URL cannot contain spaces.' }
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
  const candidate = hasScheme ? trimmed : `https://${trimmed}`

  let parsed
  try {
    parsed = new URL(candidate)
  } catch {
    return { error: 'That does not look like a valid URL. Example: https://example.com' }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { error: 'Only http:// and https:// links can be scanned.' }
  }
  if (!parsed.hostname.includes('.') && !parsed.hostname.startsWith('[')) {
    return { error: 'Please enter a full domain name, such as example.com.' }
  }

  return { url: parsed.toString() }
}
