import { Router } from 'express'
import { config } from '../config.js'

const router = Router()

// GET /api/health
// Reports which threat intelligence providers are configured,
// without ever revealing the keys themselves.
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'phishguard-api',
    time: new Date().toISOString(),
    providers: {
      googleSafeBrowsing: Boolean(config.keys.googleSafeBrowsing),
      urlhaus: Boolean(config.keys.urlhaus),
      virusTotal: Boolean(config.keys.virusTotal),
    },
  })
})

export default router