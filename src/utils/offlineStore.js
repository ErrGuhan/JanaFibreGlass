import localforage from 'localforage'
import { supabase } from './supabaseClient.js'

// Initialize dedicated localforage instance named 'offlineOrders'
export const offlineOrders = localforage.createInstance({
  name: 'JanaAdminStudio',
  storeName: 'offlineOrders',
  description: 'Offline Customer Orders Storage for JANA FIBRE GLASS Admin',
})

/**
 * Save an order payload locally to IndexedDB when offline
 */
export async function saveOfflineOrder(order) {
  const uuid = order.id || 'order-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
  const timestamp = order.createdAt || new Date().toISOString()

  const fullOrder = {
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
export async function getOfflineOrders() {
  const list = []
  try {
    await offlineOrders.iterate((value) => {
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
export async function getUnsyncedCount() {
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
 * Removes item from localforage ONLY if server returns 200/201 OK.
 */
export async function syncOfflineOrders() {
  let syncedCount = 0
  let remainingCount = 0

  try {
    const keys = await offlineOrders.keys()
    for (const key of keys) {
      const order = await offlineOrders.getItem(key)
      if (!order) continue

      let uploadedUrls = order.documentUrls || []

      // Check if cached order payload contains any local File objects (e.g., site photos or PDF specs)
      if (order.files && order.files.length > 0) {
        for (const file of order.files) {
          try {
            const fileName = `${Date.now()}_${file.name || 'document.pdf'}`
            const filePath = `orders/${order.id || 'order'}/${fileName}`

            // Write upload sequence using supabase.storage.from('customer-documents').upload()
            const { data, error } = await supabase.storage
              .from('customer-documents')
              .upload(filePath, file, { upsert: true })

            if (!error && data) {
              // Retrieve returned public URL
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

      // Append public URLs to order payload before POST request to Express backend
      const payloadToSend = {
        ...order,
        documentUrls: uploadedUrls,
        files: undefined, // strip raw File objects before sending JSON
      }

      try {
        const response = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
