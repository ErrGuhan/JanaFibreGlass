import express, { Request, Response } from 'express'
import prisma from './lib/prisma'
import configurationsRouter from './routes/configurations'
import contentRouter from './routes/content'
import ordersRouter from './routes/orders'

const app = express()

app.use(express.json())

// Register API Route Handlers
app.use(configurationsRouter)
app.use(contentRouter)
app.use(ordersRouter)

/**
 * GET /api/health
 * End-to-End Connectivity Health Check Endpoint.
 * Executes active Prisma query against PostgreSQL database.
 */
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Active database query verification
    await prisma.$queryRaw`SELECT 1`
    
    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error: any) {
    console.error('Health-check database query error:', error)
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: error?.message || 'Database connection failed',
      timestamp: new Date().toISOString(),
    })
  }
})

export default app
