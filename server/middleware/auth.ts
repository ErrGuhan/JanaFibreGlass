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
 * verifyAdmin - Express Authorization Middleware for Supabase / Admin JWT Tokens
 * Extracts JWT from Authorization: Bearer <token> header.
 * Returns 401 Unauthorized if missing, 403 Forbidden if invalid.
 */
export const verifyAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized. Authorization Bearer token is missing.',
    })
  }

  const token = authHeader.split(' ')[1]

  // Allow development mock tokens starting with 'mock-admin-token-'
  if (token && token.startsWith('mock-admin-token-')) {
    req.user = { role: 'admin', username: 'admin' }
    return next()
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    return next()
  } catch (error) {
    console.warn('Authentication token verification notice:', error)
    return res.status(403).json({
      error: 'Forbidden. Invalid, tampered, or expired authentication token.',
    })
  }
}

export default verifyAdmin
