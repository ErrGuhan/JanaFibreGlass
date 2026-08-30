import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyAdmin } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * POST /api/admin/orders
 * Protected route: Receives and persists customer orders into PostgreSQL via Prisma.
 */
router.post('/api/admin/orders', verifyAdmin, async (req: Request, res: Response) => {
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
      documentUrls,
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
        ...(documentUrls && documentUrls.length > 0
          ? {
              documents: {
                create: documentUrls.map((url: string) => ({
                  fileName: 'Customer_Attachment.pdf',
                  fileType: 'TechnicalSpec',
                  fileUrl: url,
                })),
              },
            }
          : {}),
      },
      include: {
        documents: true,
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
        documents: configRecord.documents,
      },
    })
  } catch (error) {
    console.error('Error saving order on server:', error)
    return res.status(500).json({ error: 'Server error while saving order.' })
  }
})

/**
 * GET /api/admin/orders
 * Protected route: Returns list of all customer orders.
 */
router.get('/api/admin/orders', verifyAdmin, async (_req: Request, res: Response) => {
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
