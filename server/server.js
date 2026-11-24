import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import healthRouter from './routes/health.js'
import scanRouter from './routes/scan.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

const app = express()

// Needed when running behind a proxy such as Render
app.set('trust proxy', 1)
app.disable('x-powered-by')

// Security headers
app.use(helmet())

// CORS: only allow configured frontend origins
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, health checks) which send no Origin
      if (!origin || config.clientOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST'],
  }),
)

// Small body limit: a URL scan never needs a large payload
app.use(express.json({ limit: '10kb' }))

// General rate limit for all API routes
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'RATE_LIMITED',
      message: 'Too many requests. Please wait a minute and try again.',
    },
  }),
)

// Routes
app.use('/api/health', healthRouter)
app.use('/api/scan', scanRouter)

// Fallbacks
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`PhishGuard API running on http://localhost:${config.port}`)
})