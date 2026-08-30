import express from 'express'
import configurationsRouter from './routes/configurations'
import contentRouter from './routes/content'
import ordersRouter from './routes/orders'

const app = express()

app.use(express.json())

// Register API Route Handlers
app.use(configurationsRouter)
app.use(contentRouter)
app.use(ordersRouter)

// Health Check Endpoint for Vercel
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
