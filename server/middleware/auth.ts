import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SUPABASE_SECRET_KEY ||
  'jana-fibre-glass-admin-jwt-secret-key-2026'

export interface AuthenticatedRequest extends Request {
  user?: any
}

/**
 * verifyAdmin - Express Authorization Middleware
 * Verifies JWT token from Authorization: Bearer <token> header for write operations.
 */
export const verifyAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access denied. Authorization Bearer token is missing.',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.warn('JWT verification failed:', error)
    return res.status(403).json({
      error: 'Forbidden. Invalid, tampered, or expired authentication token.',
    })
  }
}

export default verifyAdmin
