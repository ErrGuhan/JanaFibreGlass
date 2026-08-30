import express, { Request, Response } from 'express'
import prisma from '../lib/prisma'
import jwt from 'jsonwebtoken'
import { verifyAdmin, JWT_SECRET } from '../middleware/auth'

const router = express.Router()

const DEFAULT_CONTENT = {
  id: 1,
  heroHeadline: 'Precision Engineered Custom Doors',
  heroSubtext:
    'Experience the next generation of architectural fiberglass doors. Tailored to your exact millimetric dimensions, 100% waterproof, termite-proof, and designed live in 3D.',
  aboutUsText:
    'JANA FIBRE GLASS is a premier manufacturer specializing in advanced Fiber-Reinforced Polymer (FRP) composite doors, frames, and custom architectural elements. With over two decades of engineering excellence, we supply durable, high-impact door solutions for residential, commercial, industrial, and coastal installations across India.',
  contactPhone: '+91 6383236623',
  contactEmail: 'info@janafibreglass.com',
}

/**
 * GET /api/content
 * Public route to fetch the single SiteContent record (id: 1).
 */
router.get('/api/content', async (_req: Request, res: Response) => {
  try {
    let content = await prisma.siteContent.findUnique({
      where: { id: 1 },
    })

    if (!content) {
      content = await prisma.siteContent.create({
        data: DEFAULT_CONTENT,
      })
    }

    return res.status(200).json(content)
  } catch (error: any) {
    console.error('Error fetching site content from database:', error)
    
    // Check if error is database connectivity failure
    if (
      error?.name === 'PrismaClientInitializationError' ||
      error?.code === 'P1001' ||
      error?.code === 'P1002'
    ) {
      return res.status(503).json({
        error: 'Database connection failed',
        details: error?.message || 'Database unreachable',
        fallback: DEFAULT_CONTENT,
      })
    }

    // Fallback response for minor DB errors
    return res.status(200).json(DEFAULT_CONTENT)
  }
})

/**
 * PUT /api/content
 * Protected admin route: Updates SiteContent record (id: 1).
 */
router.put('/api/content', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { heroHeadline, heroSubtext, aboutUsText, contactPhone, contactEmail } = req.body

    const updated = await prisma.siteContent.upsert({
      where: { id: 1 },
      update: {
        heroHeadline,
        heroSubtext,
        aboutUsText,
        contactPhone,
        contactEmail,
      },
      create: {
        id: 1,
        heroHeadline: heroHeadline || DEFAULT_CONTENT.heroHeadline,
        heroSubtext: heroSubtext || DEFAULT_CONTENT.heroSubtext,
        aboutUsText: aboutUsText || DEFAULT_CONTENT.aboutUsText,
        contactPhone: contactPhone || DEFAULT_CONTENT.contactPhone,
        contactEmail: contactEmail || DEFAULT_CONTENT.contactEmail,
      },
    })

    return res.status(200).json({
      message: 'Site content updated successfully.',
      data: updated,
    })
  } catch (error: any) {
    console.error('Error updating site content in database:', error)

    if (
      error?.name === 'PrismaClientInitializationError' ||
      error?.code === 'P1001' ||
      error?.code === 'P1002'
    ) {
      return res.status(503).json({
        error: 'Database connection failed',
        details: error?.message || 'Database server is currently unavailable.',
      })
    }

    return res.status(500).json({
      error: 'Failed to update site content in database.',
    })
  }
})

/**
 * POST /api/admin/login
 * Issues a signed JWT token upon valid credentials.
 */
router.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const expectedUser = process.env.ADMIN_USER || 'admin'
    const expectedPass = process.env.ADMIN_PASS || 'admin123'

    if (username === expectedUser && password === expectedPass) {
      const token = jwt.sign(
        { username, role: 'admin', iat: Math.floor(Date.now() / 1000) },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.status(200).json({
        success: true,
        token,
        message: 'Admin authentication successful.',
      })
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid username or password.',
    })
  } catch (error) {
    console.error('Error during admin login:', error)
    return res.status(500).json({
      error: 'Internal server error during login.',
    })
  }
})

export default router
