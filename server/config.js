import 'dotenv/config'

const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  port: toNumber(process.env.PORT, 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  providerTimeoutMs: toNumber(process.env.PROVIDER_TIMEOUT_MS, 6000),
  keys: {
    googleSafeBrowsing: process.env.GOOGLE_SAFE_BROWSING_API_KEY || '',
    urlhaus: process.env.URLHAUS_AUTH_KEY || '',
    virusTotal: process.env.VIRUSTOTAL_API_KEY || '',
  },
}