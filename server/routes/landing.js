import { Router } from 'express'
import { landingContent } from '../data/landing.js'

const router = Router()

// GET /api/landing
// Returns the landing page content in the format:
// { status_code, status, data: { hero_image, hero_text, section_one, ... } }
router.get('/', (req, res) => {
  res.status(200).json({
    status_code: 200,
    status: 'Success',
    data: landingContent,
  })
})

export default router
