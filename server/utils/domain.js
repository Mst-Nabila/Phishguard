// Common two-part public suffixes. Not a full Public Suffix List,
// which is documented as a known limitation.
const TWO_PART_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
  'com.au', 'net.au', 'org.au',
  'co.in', 'co.jp', 'co.nz', 'co.za',
  'com.br', 'com.bd', 'com.sg', 'com.my', 'com.tr', 'com.mx', 'com.cn',
])

// Returns { registrable, subdomains } for a hostname.
export function splitHostname(labels) {
  if (labels.length <= 2) {
    return { registrable: labels.join('.'), subdomains: [] }
  }
  const lastTwo = labels.slice(-2).join('.')
  const keep = TWO_PART_SUFFIXES.has(lastTwo) ? 3 : 2
  return {
    registrable: labels.slice(-keep).join('.'),
    subdomains: labels.slice(0, labels.length - keep),
  }
}

// Brands often impersonated. Used only to detect a brand name appearing
// in a domain that does not actually belong to that brand.
export const BRANDS = [
  { name: 'PayPal', token: 'paypal', domains: ['paypal.com'] },
  { name: 'Google', token: 'google', domains: ['google.com', 'google.co.uk', 'googleapis.com'] },
  { name: 'Microsoft', token: 'microsoft', domains: ['microsoft.com', 'live.com', 'office.com', 'microsoftonline.com'] },
  { name: 'Apple', token: 'apple', domains: ['apple.com', 'icloud.com'] },
  { name: 'Amazon', token: 'amazon', domains: ['amazon.com', 'amazon.co.uk', 'amazon.in'] },
  { name: 'Facebook', token: 'facebook', domains: ['facebook.com', 'fb.com'] },
  { name: 'Instagram', token: 'instagram', domains: ['instagram.com'] },
  { name: 'Netflix', token: 'netflix', domains: ['netflix.com'] },
  { name: 'LinkedIn', token: 'linkedin', domains: ['linkedin.com'] },
  { name: 'Dropbox', token: 'dropbox', domains: ['dropbox.com'] },
  { name: 'WhatsApp', token: 'whatsapp', domains: ['whatsapp.com'] },
  { name: 'bKash', token: 'bkash', domains: ['bkash.com'] },
]
