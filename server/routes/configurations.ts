import express, { Request, Response } from 'express'
import { PrismaClient, ConfigurationStatus } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * POST /api/configurations
 * Creates and persists a new door configuration visualization in PostgreSQL.
 */
router.post('/api/configurations', async (req: Request, res: Response) => {
  try {
    const {
      topWidth,
      bottomWidth,
      leftHeight,
      rightHeight,
      thickness,
      hexColor,
      status,
    } = req.body

    // Input Validation
    if (
      topWidth === undefined ||
      bottomWidth === undefined ||
      leftHeight === undefined ||
      rightHeight === undefined ||
      thickness === undefined ||
      !hexColor
    ) {
      return res.status(400).json({
        error: 'Missing required door parameter fields.',
      })
    }

    // Save to PostgreSQL via Prisma
    const newConfiguration = await prisma.doorConfiguration.create({
      data: {
        topWidth: Number(topWidth),
        bottomWidth: Number(bottomWidth),
        leftHeight: Number(leftHeight),
        rightHeight: Number(rightHeight),
        thickness: Number(thickness),
        hexColor: String(hexColor),
        status: status ? (status as ConfigurationStatus) : ConfigurationStatus.Draft,
      },
      include: {
        documents: true,
      },
    })

    return res.status(201).json({
      message: 'Door configuration saved successfully.',
      data: newConfiguration,
    })
  } catch (error) {
    console.error('Error saving configuration:', error)
    return res.status(500).json({
      error: 'Internal Server Error while saving configuration.',
    })
  }
})

/**
 * GET /api/configurations
 * Retrieves all saved door configurations with associated documents.
 */
router.get('/api/configurations', async (_req: Request, res: Response) => {
  try {
    const configurations = await prisma.doorConfiguration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: true,
      },
    })

    return res.status(200).json({
      count: configurations.length,
      data: configurations,
    })
  } catch (error) {
    console.error('Error fetching configurations:', error)
    return res.status(500).json({
      error: 'Internal Server Error while fetching configurations.',
    })
  }
})

export default router
