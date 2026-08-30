import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * POST /api/admin/orders
 * Receives and persists customer orders (online or synced from offline store).
 */
router.post('/api/admin/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      width,
      leftHeight,
      rightHeight,
      thickness,
      colorName,
      colorHex,
      notes,
    } = req.body

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' })
    }

    // Persist to DoorConfiguration in Prisma
    const configRecord = await prisma.doorConfiguration.create({
      data: {
        topWidth: Number(width || 84.0),
        bottomWidth: Number(width || 84.0),
        leftHeight: Number(leftHeight || 210.0),
        rightHeight: Number(rightHeight || 210.0),
        thickness: Number(thickness || 4.5),
        hexColor: String(colorHex || '#d4a373'),
        status: 'Ordered',
      },
    })

    return res.status(201).json({
      message: 'Order created successfully on server.',
      data: {
        configId: configRecord.id,
        customerName,
        customerPhone,
        colorName,
        notes,
        createdAt: configRecord.createdAt,
      },
    })
  } catch (error) {
    console.error('Error saving order on server:', error)
    return res.status(500).json({ error: 'Server error while saving order.' })
  }
})

/**
 * GET /api/admin/orders
 * Returns list of all customer orders.
 */
router.get('/api/admin/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.doorConfiguration.findMany({
      orderBy: { createdAt: 'desc' },
      include: { documents: true },
    })
    return res.status(200).json({ data: orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return res.status(500).json({ error: 'Failed to fetch orders.' })
  }
})

export default router
