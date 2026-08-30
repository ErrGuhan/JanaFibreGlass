export interface SiteContentData {
  id?: number
  heroHeadline: string
  heroSubtext: string
  aboutUsText: string
  contactPhone: string
  contactEmail: string
  updatedAt?: string
}

const STORAGE_KEY = 'jana_site_content'

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  id: 1,
  heroHeadline: 'Precision Engineered Custom Doors',
  heroSubtext:
    'Experience the next generation of architectural fiberglass doors. Tailored to your exact millimetric dimensions, 100% waterproof, termite-proof, and designed live in 3D.',
  aboutUsText:
    'JANA FIBRE GLASS is a premier manufacturer specializing in advanced Fiber-Reinforced Polymer (FRP) composite doors, frames, and custom architectural elements. With over two decades of engineering excellence, we supply durable, high-impact door solutions for residential, commercial, industrial, and coastal installations across India.',
  contactPhone: '+91 6383236623',
  contactEmail: 'info@janafibreglass.com',
}

export async function fetchSiteContent(): Promise<SiteContentData> {
  try {
    const res = await fetch('/api/content')
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    }
  } catch (err) {
    console.warn('API /api/content unavailable, using local cache:', err)
  }

  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch (e) {
      console.error('Failed to parse cached site content:', e)
    }
  }
  return DEFAULT_SITE_CONTENT
}

export async function updateSiteContent(payload: SiteContentData): Promise<SiteContentData> {
  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const result = await res.json()
      const data = result.data || result
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    }
  } catch (err) {
    console.warn('API /api/content PUT unavailable, updating local storage:', err)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      return await res.json()
    }
    const err = await res.json()
    return { success: false, error: err.error || 'Authentication failed' }
  } catch (err) {
    console.warn('Backend login endpoint unavailable, checking default admin credentials:', err)
    if (username === 'admin' && password === 'admin123') {
      const token = 'mock-admin-token-' + Date.now()
      return { success: true, token }
    }
    return { success: false, error: 'Invalid username or password.' }
  }
}
