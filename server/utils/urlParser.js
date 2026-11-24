const MAX_URL_LENGTH = 2048

// Parses a user-submitted string into a safe, structured object.
// This only analyses text. It never makes a network request.
export function parseUrl(input) {
  const raw = typeof input === 'string' ? input.trim() : ''

  if (!raw) {
    return { error: 'A URL is required.' }
  }
  if (raw.length > MAX_URL_LENGTH) {
    return { error: `URL is too long (maximum ${MAX_URL_LENGTH} characters).` }
  }
  // eslint-disable-next-line no-control-regex
  if (/\s/.test(raw) || /[\u0000-\u001f]/.test(raw)) {
    return { error: 'URL must not contain spaces or control characters.' }
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
  const candidate = hasScheme ? raw : `https://${raw}`

  let parsed
  try {
    parsed = new URL(candidate)
  } catch {
    return { error: 'The value is not a valid URL.' }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { error: 'Only http and https URLs can be analysed.' }
  }

  const hostname = parsed.hostname.toLowerCase()
  const isIpv6 = hostname.startsWith('[')
  const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)

  if (!isIpv6 && !isIpv4 && !hostname.includes('.')) {
    return { error: 'Please provide a full domain name, such as example.com.' }
  }

  const labels = hostname.split('.')

  return {
    raw,
    href: parsed.toString(),
    protocol: parsed.protocol.replace(':', ''),
    hostname,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    hasCredentials: Boolean(parsed.username || parsed.password),
    isIp: isIpv4 || isIpv6,
    labels,
    length: parsed.toString().length,
  }
}
