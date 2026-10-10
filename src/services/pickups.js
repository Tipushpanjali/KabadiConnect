import { requireSupabase } from '../lib/supabaseClient'

export async function listAvailableRecyclers(category) {
  const client = requireSupabase()
  const { data, error } = await client.from('recycler_directory').select('*').eq('available', true).order('business_name').limit(50)
  if (error) throw error
  const ids = (data || []).map((r) => r.id)
  if (!ids.length) return []
  const { data: rateRows, error: ratesError } = await client.from('recycler_rates').select('recycler_id,category_id,rate_per_kg,accepts').in('recycler_id', ids).eq('accepts', true)
  if (ratesError) throw ratesError
  return (data || []).map((r) => {
    const rates = Object.fromEntries((rateRows || []).filter((x) => x.recycler_id === r.id).map((x) => [x.category_id, Number(x.rate_per_kg)]))
    return { id: r.id, business: r.business_name, name: r.business_name, area: r.service_areas?.[0] || '', verified: true, rating: Number(r.average_rating), reviews: r.review_count, availability: 'Available', accepts: Object.keys(rates), rates }
  }).filter((r) => !category || r.accepts.includes(category))
}

export async function uploadPickupPhoto(file) {
  if (!file) return null
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Choose a JPG, PNG, or WebP photo under 5 MB.')
  const client = requireSupabase()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Sign in before uploading a pickup photo.')
  const path = `${user.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`
  const { error } = await client.storage.from('pickup-photos').upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  return path
}

export async function createPickupRequest({ recyclerId, category, quantity, scheduledAt, address, notes, imagePath }) {
  const { data, error } = await requireSupabase().rpc('create_pickup', {
    p_recycler: recyclerId, p_category: category, p_quantity: quantity, p_scheduled: scheduledAt,
    p_address: address, p_notes: notes || null, p_image_path: imagePath || null,
  })
  if (error) throw error
  return data
}
