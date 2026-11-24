import { splitHostname, BRANDS } from '../utils/domain.js'

const SENSITIVE_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'account',
  'update', 'secure', 'security', 'password', 'confirm', 'banking',
  'wallet', 'suspend', 'unlock', 'billing', 'invoice',
]

const SUSPICIOUS_TLDS = new Set([
  'zip', 'mov', 'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'click',
  'work', 'support', 'country', 'kim', 'loan', 'men', 'review',
])

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
  'buff.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at',
])

// Each check returns an indicator object, or null when nothing is found.
// Indicator: { id, label, points, severity, detail }
// `points` is added to the heuristic risk score.

function checkHttps(url) {
  if (url.protocol === 'https') return null
  return {
    id: 'no-https',
    label: 'Connection is not encrypted',
    points: 15,
    severity: 'medium',
    detail:
      'The URL uses http instead of https, so data sent to the site is not encrypted. Note that https alone does not prove a site is safe.',
  }
}

function checkIpHostname(url) {
  if (!url.isIp) return null
  return {
    id: 'ip-hostname',
    label: 'Address uses an IP number instead of a domain name',
    points: 30,
    severity: 'high',
    detail:
      'Legitimate services almost always use a registered domain name. Raw IP addresses are commonly used to hide the real destination.',
  }
}

function checkCredentialsInUrl(url) {
  if (!url.hasCredentials) return null
  return {
    id: 'credentials-in-url',
    label: 'URL contains a username or password before the domain',
    points: 30,
    severity: 'high',
    detail:
      'A format like https://trusted.com@evil.com makes the real destination (after the @) look like a trusted name.',
  }
}

function checkSubdomainDepth(url, parts) {
  if (url.isIp) return null
  const depth = parts.subdomains.length
  if (depth >= 4) {
    return {
      id: 'subdomain-depth-high',
      label: `Very deep subdomain structure (${depth} levels)`,
      points: 20,
      severity: 'high',
      detail:
        'Attackers stack many subdomains so that a trusted-looking name appears at the start while the real domain is hidden at the end.',
    }
  }
  if (depth === 3) {
    return {
      id: 'subdomain-depth-medium',
      label: 'Many subdomain levels (3)',
      points: 10,
      severity: 'medium',
      detail: 'More subdomain levels than usual can be used to disguise the real domain.',
    }
  }
  return null
}

function checkLength(url) {
  if (url.length >= 120) {
    return {
      id: 'length-long',
      label: `Very long URL (${url.length} characters)`,
      points: 12,
      severity: 'medium',
      detail: 'Very long addresses can hide the important part of the link from the reader.',
    }
  }
  if (url.length >= 75) {
    return {
      id: 'length-medium',
      label: `Long URL (${url.length} characters)`,
      points: 5,
      severity: 'low',
      detail: 'Longer than typical URLs. This is a weak signal on its own.',
    }
  }
  return null
}

function checkKeywords(url, parts) {
  const haystack = `${parts.subdomains.join('.')} ${url.pathname} ${url.search}`.toLowerCase()
  const found = SENSITIVE_KEYWORDS.filter((word) => haystack.includes(word))
  if (found.length === 0) return null

  // One keyword is a weak signal. Several together are stronger.
  const points = found.length >= 3 ? 18 : found.length === 2 ? 10 : 4
  return {
    id: 'sensitive-keywords',
    label: `Sensitive keyword${found.length > 1 ? 's' : ''} found: ${found.slice(0, 5).join(', ')}`,
    points,
    severity: found.length >= 3 ? 'medium' : 'low',
    detail:
      'Words like login or verify appear in many legitimate sites too. They only matter in combination with other indicators.',
  }
}

function checkBrandImpersonation(url, parts) {
  if (url.isIp) return null
  const registrable = parts.registrable
  const hostOnly = url.hostname

  for (const brand of BRANDS) {
    if (!hostOnly.includes(brand.token)) continue
    const isOfficial = brand.domains.some(
      (domain) => registrable === domain || hostOnly === domain || hostOnly.endsWith(`.${domain}`),
    )
    if (!isOfficial) {
      return {
        id: 'brand-impersonation',
        label: `Contains "${brand.name}" but is not a ${brand.name} domain`,
        points: 35,
        severity: 'high',
        detail: `The real domain is ${registrable}. Phishing sites often include a well-known brand name inside a different domain to look legitimate.`,
      }
    }
  }
  return null
}

function checkHyphensAndDigits(url, parts) {
  if (url.isIp) return null
  const name = parts.registrable.split('.')[0]
  const hyphens = (name.match(/-/g) || []).length
  const digits = (name.match(/\d/g) || []).length

  if (hyphens >= 3) {
    return {
      id: 'many-hyphens',
      label: `Domain name has ${hyphens} hyphens`,
      points: 10,
      severity: 'medium',
      detail: 'Multiple hyphens are common in made-up domains that imitate real brands.',
    }
  }
  if (digits >= 4) {
    return {
      id: 'many-digits',
      label: 'Domain name contains many digits',
      points: 6,
      severity: 'low',
      detail: 'Long number sequences in a domain name are uncommon for established services.',
    }
  }
  return null
}

function checkPunycode(url) {
  if (!url.labels.some((label) => label.startsWith('xn--'))) return null
  return {
    id: 'punycode',
    label: 'Domain uses internationalised (punycode) characters',
    points: 20,
    severity: 'high',
    detail:
      'Look-alike characters from other alphabets can make a fake domain appear identical to a real one.',
  }
}

function checkTld(url) {
  if (url.isIp) return null
  const tld = url.labels[url.labels.length - 1]
  if (!SUSPICIOUS_TLDS.has(tld)) return null
  return {
    id: 'suspicious-tld',
    label: `Domain ends in .${tld}`,
    points: 8,
    severity: 'low',
    detail:
      'This ending is cheap or free to register and is over-represented in abuse reports. Many legitimate sites also use it, so this is a weak signal.',
  }
}

function checkPort(url) {
  if (!url.port) return null
  if (['80', '443'].includes(url.port)) return null
  return {
    id: 'unusual-port',
    label: `Non-standard port (${url.port})`,
    points: 8,
    severity: 'low',
    detail: 'Public websites normally use the default web ports.',
  }
}

function checkShortener(url, parts) {
  if (!SHORTENERS.has(parts.registrable)) return null
  return {
    id: 'url-shortener',
    label: 'Link uses a URL shortening service',
    points: 12,
    severity: 'medium',
    detail:
      'Shortened links hide the real destination. PhishGuard does not open links, so the final address cannot be inspected.',
  }
}

function checkAtSymbolInPath(url) {
  if (url.hasCredentials) return null
  if (!`${url.pathname}${url.search}`.includes('@')) return null
  return {
    id: 'at-in-path',
    label: 'The @ symbol appears in the path or query',
    points: 6,
    severity: 'low',
    detail: 'Unusual in normal links and sometimes used to confuse readers.',
  }
}

// Runs every check and returns the list of indicators that fired.
export function runHeuristics(url) {
  const parts = splitHostname(url.labels)
  const indicators = [
    checkHttps(url),
    checkIpHostname(url),
    checkCredentialsInUrl(url),
    checkSubdomainDepth(url, parts),
    checkLength(url),
    checkKeywords(url, parts),
    checkBrandImpersonation(url, parts),
    checkHyphensAndDigits(url, parts),
    checkPunycode(url),
    checkTld(url),
    checkPort(url),
    checkShortener(url, parts),
    checkAtSymbolInPath(url),
  ].filter(Boolean)

  return { indicators, parts }
}
