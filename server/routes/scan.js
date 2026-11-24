import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { parseUrl } from '../utils/urlParser.js'
import { analyzeUrl } from '../services/analyzer.js'

const router = Router()

// Stricter limit for scanning than for the rest of the API
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many scans. Please wait a minute and try again.',
  },
})

// POST /api/scan   body: { "url": "https://example.com" }
router.post('/', scanLimiter, async (req, res, next) => {
  try {
    const body = req.body

    if (!body || typeof body !== 'object' || typeof body.url !== 'string') {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Send a JSON body like { "url": "https://example.com" }.',
      })
    }

    const parsed = parseUrl(body.url)
    if (parsed.error) {
      return res.status(400).json({ error: 'INVALID_URL', message: parsed.error })
    }

    const result = await analyzeUrl(parsed)
    return res.json(result)
  } catch (error) {
    return next(error)
  }
})

export default router
