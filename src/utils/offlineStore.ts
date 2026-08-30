import localforage from 'localforage'
import { supabase } from './supabaseClient'

export interface OrderPayload {
  id?: string
  customerName: string
  customerPhone: string
  width: number
  leftHeight: number
  rightHeight: number
  thickness: number
  colorName: string
  colorHex: string
  notes?: string
  status?: string
  createdAt?: string
  files?: File[]
  documentUrls?: string[]
}

// Initialize dedicated localforage instance named 'offlineOrders'
export const offlineOrders = localforage.createInstance({
  name: 'JanaAdminStudio',
  storeName: 'offlineOrders',
  description: 'Offline Customer Orders Storage for JANA FIBRE GLASS Admin',
})

/**
 * Save an order payload locally to IndexedDB when offline
 */
export async function saveOfflineOrder(order: OrderPayload): Promise<OrderPayload> {
  const uuid = order.id || 'order-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
  const timestamp = order.createdAt || new Date().toISOString()

  const fullOrder: OrderPayload = {
    ...order,
    id: uuid,
    createdAt: timestamp,
    status: order.status || 'Pending Offline Sync',
  }

  await offlineOrders.setItem(uuid, fullOrder)
  return fullOrder
}

/**
 * Retrieve all cached offline orders
 */
export async function getOfflineOrders(): Promise<OrderPayload[]> {
  const list: OrderPayload[] = []
  try {
    await offlineOrders.iterate((value: OrderPayload) => {
      list.push(value)
    })
  } catch (err) {
    console.error('Failed to read offline orders from IndexedDB:', err)
  }
  return list
}

/**
 * Return count of unsynced offline orders in IndexedDB
 */
export async function getUnsyncedCount(): Promise<number> {
  try {
    const keys = await offlineOrders.keys()
    return keys.length
  } catch (err) {
    console.error('Error counting offline orders:', err)
    return 0
  }
}

/**
 * Sync offline orders from localforage to backend Express API /api/admin/orders.
 * Handles file uploads to Supabase storage ('customer-documents') before POSTing to Express backend.
 * Includes Authorization: Bearer <token> header for admin verification.
 */
export async function syncOfflineOrders(): Promise<{ syncedCount: number; remainingCount: number }> {
  let syncedCount = 0
  let remainingCount = 0
  const token = localStorage.getItem('adminToken')

  try {
    const keys = await offlineOrders.keys()
    for (const key of keys) {
      const order = await offlineOrders.getItem<OrderPayload>(key)
      if (!order) continue

      let uploadedUrls: string[] = order.documentUrls || []

      // Cloud Storage Upload Sequence via Supabase
      if (order.files && order.files.length > 0) {
        for (const file of order.files) {
          try {
            const fileName = `${Date.now()}_${file.name || 'document.pdf'}`
            const filePath = `orders/${order.id || 'order'}/${fileName}`

            const { data, error } = await supabase.storage
              .from('customer-documents')
              .upload(filePath, file, { upsert: true })

            if (!error && data) {
              const { data: publicUrlData } = supabase.storage
                .from('customer-documents')
                .getPublicUrl(data.path)

              if (publicUrlData?.publicUrl) {
                uploadedUrls.push(publicUrlData.publicUrl)
              }
            }
          } catch (uploadErr) {
            console.warn('Supabase storage file upload warning:', uploadErr)
          }
        }
      }

      // Attach retrieved public URLs to order payload before POSTing to Express backend
      const payloadToSend = {
        ...order,
        documentUrls: uploadedUrls,
        files: undefined, // Strip raw File object before sending JSON payload
      }

      try {
        const response = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payloadToSend),
        })

        if (response.ok) {
          await offlineOrders.removeItem(key)
          syncedCount++
        } else {
          remainingCount++
        }
      } catch (netErr) {
        console.warn(`Server unreachable during sync for order ${key}:`, netErr)
        remainingCount++
      }
    }
  } catch (err) {
    console.error('Error running syncOfflineOrders:', err)
  }

  return { syncedCount, remainingCount }
}
