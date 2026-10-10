import { requireSupabase } from '../lib/supabaseClient'

const client = () => requireSupabase()
const throwIf = ({ error }) => { if (error) throw error }
const dateOnly = (value) => value ? value.slice(0, 10) : ''
const timeLabel = (value) => value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''

export function mapPickup(row) {
  const address = row.address_snapshot || {}
  return {
    ...row, public_reference: row.public_reference, userId: row.customer_id, recyclerId: row.recycler_id,
    waste: row.category_id, qty: Number(row.final_quantity ?? row.estimated_quantity), date: dateOnly(row.scheduled_at),
    time: timeLabel(row.scheduled_at), value: Number(row.final_value ?? row.estimated_price),
    address: address.address_line || '', customer: 'Household', recycler_business: row.recycler_profiles?.business_name || 'Recycler',
    status: row.status,
  }
}

export async function getAppData(session) {
  const db = client()
  const result = { pickups: [], points: 0, pointsLog: [], redeemed: [], rewards: [], notifs: [], rates: {}, docs: [], adminUsers: [], adminVerif: [], reports: [], societies: [], recyclers: [], transactions: [], reviews: [], earningsExtra: 0, recyclerId: null, recyclerProfile: null, verificationStatus: 'Pending', address: '', preferences: null }
  if (!session) return result
  if (session.role === 'user' || session.role === 'admin') {
    const { data, error } = await db.from('pickup_requests').select('*,recycler_profiles(business_name)').order('created_at', { ascending: false }).limit(100)
    if (error) throw error
    result.pickups = (data || []).map(mapPickup)
  } else if (session.role === 'recycler') {
    const { data: own, error: ownError } = await db.from('recycler_profiles').select('id,business_name,business_details,service_areas,contact_phone,available,verification_status').eq('owner_id', session.id).maybeSingle()
    if (ownError) throw ownError
    if (own) {
      const { data, error } = await db.from('pickup_requests').select('*,recycler_profiles(business_name)').eq('recycler_id', own.id).order('created_at', { ascending: false }).limit(100)
      if (error) throw error
      result.pickups = (data || []).map(mapPickup)
      const { data: rates, error: ratesError } = await db.from('recycler_rates').select('category_id,rate_per_kg,accepts').eq('recycler_id', own.id)
      if (ratesError) throw ratesError
      result.rates = Object.fromEntries((rates || []).map((r) => [r.category_id, { rate: Number(r.rate_per_kg), active: r.accepts }]))
      const { data: docs, error: docsError } = await db.from('recycler_documents').select('*').eq('recycler_id', own.id).order('created_at')
      if (docsError) throw docsError
      result.docs = docs || []
      result.recyclerId = own.id
      result.recyclerProfile = own
      result.verificationStatus = own.verification_status === 'verified' ? 'Verified' : own.verification_status === 'rejected' ? 'Rejected' : 'In review'
      const { data: transactions, error: transactionError } = await db.from('pickup_transactions').select('id,pickup_id,amount,payment_status,settled_at,pickup_requests(public_reference,category_id,final_quantity,scheduled_at)').eq('recycler_id', own.id).order('settled_at', { ascending: false }).limit(200)
      if (transactionError) throw transactionError
      result.transactions = (transactions || []).map((t) => ({ ...t, txn: t.id, public_reference: t.pickup_requests?.public_reference, waste: t.pickup_requests?.category_id, qty: Number(t.pickup_requests?.final_quantity || 0), value: Number(t.amount), date: dateOnly(t.settled_at || t.pickup_requests?.scheduled_at), paid: t.payment_status === 'paid' ? 'Paid' : t.payment_status[0].toUpperCase() + t.payment_status.slice(1) }))
      result.earningsExtra = (transactions || []).reduce((sum, t) => sum + Number(t.amount), 0)
      const { data: reviews, error: reviewsError } = await db.from('recycler_reviews').select('id,rating,comment,created_at').eq('recycler_id', own.id).order('created_at', { ascending: false }).limit(100)
      if (reviewsError) throw reviewsError
      result.reviews = reviews || []
    }
  } else if (session.role === 'society') {
    const { data, error } = await db.from('societies').select('*,society_memberships(*)').eq('manager_id', session.id).limit(20)
    if (error) throw error
    result.societies = data || []
  }
  const { data: notifications, error: notifyError } = await db.from('notifications').select('*').order('created_at', { ascending: false }).limit(100)
  if (notifyError) throw notifyError
  result.notifs = (notifications || []).map((n) => ({ ...n, text: n.message, read: Boolean(n.read_at), time: timeLabel(n.created_at), icon: n.notification_type === 'pickup' ? 'Package' : 'Bell' }))
  const { data: addresses, error: addressError } = await db.from('user_addresses').select('*').eq('user_id', session.id).order('is_default', { ascending: false }).limit(20)
  if (addressError) throw addressError
  result.address = addresses?.[0] ? `${addresses[0].address_line}, ${addresses[0].city}${addresses[0].region ? `, ${addresses[0].region}` : ''} ${addresses[0].postal_code || ''}`.trim() : ''
  const { data: preferences, error: preferencesError } = await db.from('notification_preferences').select('*').eq('user_id', session.id).maybeSingle()
  if (preferencesError) throw preferencesError
  result.preferences = preferences
  if (session.role === 'user') {
    const { data: account, error } = await db.from('points_accounts').select('balance').eq('user_id', session.id).maybeSingle()
    if (error) throw error
    result.points = Number(account?.balance || 0)
    const { data: ledger, error: ledgerError } = await db.from('points_ledger').select('*').eq('user_id', session.id).order('created_at', { ascending: false }).limit(100)
    if (ledgerError) throw ledgerError
    result.pointsLog = (ledger || []).map((x) => ({ id: x.id, label: x.description || x.entry_type, pts: Number(x.amount), date: dateOnly(x.created_at) }))
    const { data: rewards, error: rewardsError } = await db.from('rewards').select('*').eq('active', true).order('points_cost').limit(100)
    if (rewardsError) throw rewardsError
    result.rewards = (rewards || []).map((r) => ({ ...r, cost: Number(r.points_cost), title: r.title, desc: r.description, icon: 'Gift', type: r.reward_type }))
    const { data: redemptions, error: redemptionError } = await db.from('reward_redemptions').select('*,rewards(title,partner,reward_type)').eq('user_id', session.id).order('created_at', { ascending: false }).limit(100)
    if (redemptionError) throw redemptionError
    result.redeemed = (redemptions || []).map((r) => ({ ...r, date: dateOnly(r.created_at), title: r.rewards?.title, partner: r.rewards?.partner, redemption_reference: r.redemption_reference }))
  }
  if (session.role === 'admin') {
    const [{ data: users, error: usersError }, { data: societies, error: societiesError }, { data: reports, error: reportsError }] = await Promise.all([
      db.from('profiles').select('id,full_name,phone,role,account_status,created_at').order('created_at', { ascending: false }).limit(200),
      db.from('societies').select('*').order('created_at', { ascending: false }).limit(200),
      db.from('support_reports').select('*').order('created_at', { ascending: false }).limit(200),
    ])
    if (usersError) throw usersError; if (societiesError) throw societiesError; if (reportsError) throw reportsError
    result.adminUsers = (users || []).map((u) => ({ ...u, name: u.full_name, status: u.account_status === 'active' ? 'Active' : u.account_status === 'suspended' ? 'Suspended' : 'Pending', email: '' }))
    result.societies = societies || []; result.reports = reports || []
    const { data: documents, error: documentsError } = await db.from('recycler_documents').select('id,recycler_id,document_type,storage_path,review_status,created_at,recycler_profiles(business_name,service_areas)')
    if (documentsError) throw documentsError
    result.adminVerif = (documents || []).map((d) => ({ ...d, name: d.recycler_profiles?.business_name || 'Recycler', business: d.recycler_profiles?.business_name || '', area: d.recycler_profiles?.service_areas?.[0] || '', status: d.review_status[0].toUpperCase() + d.review_status.slice(1), docs: d.document_type.replaceAll('_', ' ') }))
    const { data: recyclerRows, error: recyclerError } = await db.from('recycler_profiles').select('id,business_name,service_areas,verification_status,average_rating,review_count,available').order('created_at', { ascending: false }).limit(200)
    if (recyclerError) throw recyclerError
    result.recyclers = recyclerRows || []
    result.reports = (reports || []).map((r) => ({ ...r, title: r.subject, by: 'Account holder', against: r.pickup_id ? 'Pickup support' : 'Platform support', date: dateOnly(r.created_at), status: r.status[0].toUpperCase() + r.status.slice(1) }))
  }
  return result
}

export async function listAvailableRecyclers() {
  const db = client()
  const { data, error } = await db.from('recycler_directory').select('*').eq('available', true).order('business_name').limit(100)
  if (error) throw error
  const ids = (data || []).map((r) => r.id)
  const { data: rates, error: ratesError } = ids.length ? await db.from('recycler_rates').select('recycler_id,category_id,rate_per_kg,accepts').in('recycler_id', ids) : { data: [], error: null }
  if (ratesError) throw ratesError
  const byRecycler = (rates || []).reduce((o, r) => ((o[r.recycler_id] ||= []).push(r), o), {})
  return (data || []).map((r) => { const entries = byRecycler[r.id] || []; const rateMap = Object.fromEntries(entries.map((x) => [x.category_id, Number(x.rate_per_kg)])); return { id: r.id, business: r.business_name, name: r.business_name, area: (r.service_areas || []).join(', ') || 'Service area not listed', verified: r.verification_status === 'verified', rating: Number(r.average_rating || 0), reviews: Number(r.review_count || 0), availability: 'Available for requests', rates: rateMap, accepts: entries.filter((x) => x.accepts).map((x) => x.category_id) } })
}

export async function getRecyclerDetails(id) {
  const { data, error } = await client().from('recycler_directory').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const { data: reviews, error: reviewError } = await client().from('recycler_reviews').select('id,rating,comment,created_at').eq('recycler_id', id).order('created_at', { ascending: false }).limit(10)
  if (reviewError) throw reviewError
  const { data: rates, error: ratesError } = await client().from('recycler_rates').select('category_id,rate_per_kg,accepts').eq('recycler_id', id)
  if (ratesError) throw ratesError
  return { ...data, rates: Object.fromEntries((rates || []).filter((r) => r.accepts).map((r) => [r.category_id, Number(r.rate_per_kg)])), accepts: (rates || []).filter((r) => r.accepts).map((r) => r.category_id), reviews: reviews || [] }
}

export async function getLeaderboard(tab) {
  const { data, error } = await client().rpc('leaderboard', { p_limit: 100 })
  if (error) throw error
  const kind = tab === 'Individual' ? 'user' : tab === 'Recycler' ? 'recycler' : 'society'
  return (data || []).filter((row) => row.entity_type === kind).map((row) => ({ id: row.entity_id, name: row.display_name, sub: '', value: Number(row.score || 0), metric: tab === 'Individual' ? `${Number(row.score || 0).toLocaleString('en-IN')} pts` : `${Number(row.score || 0).toLocaleString('en-IN')} ${tab === 'Recycler' ? 'pickups' : 'kg'}`, extra: '', you: Boolean(row.is_you) }))
}

export async function transitionPickup(id, status, finalQuantity, note) {
  const { data, error } = await client().rpc('transition_pickup', { p_pickup: id, p_status: status, p_final_quantity: finalQuantity ?? null, p_final_value: null, p_note: note || null })
  if (error) throw error
  return data
}

export async function redeemReward(rewardId, idempotencyKey) {
  const { data, error } = await client().rpc('redeem_reward', { p_reward: rewardId, p_idempotency_key: idempotencyKey })
  if (error) throw error
  return data
}

export async function setNotificationRead(id, read = true) {
  const q = client().from('notifications').update({ read_at: read ? new Date().toISOString() : null }).eq('id', id)
  throwIf(await q)
}

export async function clearNotifications() {
  const q = client().from('notifications').delete().not('id', 'is', null)
  throwIf(await q)
}

export async function updateRate(recyclerId, category, patch) {
  const { data, error } = await client().from('recycler_rates').upsert({ recycler_id: recyclerId, category_id: category, rate_per_kg: patch.rate, accepts: patch.active }, { onConflict: 'recycler_id,category_id' }).select().single()
  if (error) throw error
  return data
}

export async function updateRecyclerSettings(recyclerId, patch) {
  const { data, error } = await client().from('recycler_profiles').update(patch).eq('id', recyclerId).select().single()
  if (error) throw error
  return data
}

export async function updateOwnProfile(id, patch) {
  const payload = {}
  if (patch.name !== undefined || patch.full_name !== undefined) payload.full_name = patch.full_name ?? patch.name
  if (patch.phone !== undefined) payload.phone = patch.phone
  let data
  if (Object.keys(payload).length) {
    const result = await client().from('profiles').update(payload).eq('id', id).select().single()
    if (result.error) throw result.error
    data = result.data
  }
  if (patch.address !== undefined) {
    const line = String(patch.address).trim()
    const { data: old, error: oldError } = await client().from('user_addresses').select('id').eq('user_id', id).eq('is_default', true).maybeSingle()
    if (oldError) throw oldError
    const address = { user_id: id, label: 'Home', address_line: line, is_default: true }
    const q = old ? client().from('user_addresses').update(address).eq('id', old.id) : client().from('user_addresses').insert(address)
    const saved = await q
    if (saved.error) throw saved.error
  }
  return data || { id }
}

export async function saveNotificationPreferences(userId, prefs) {
  const { error } = await client().from('notification_preferences').upsert({ user_id: userId, pickup_updates: prefs.pickup, points: prefs.points, society_challenges: prefs.society, promotions: prefs.promo }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function reviewDocument(id, status, reviewerId, reason = null) {
  const { data, error } = await client().from('recycler_documents').update({ review_status: status, reviewer_id: reviewerId, rejection_reason: reason, reviewed_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function uploadRecyclerDocument(recyclerId, documentType, file) {
  if (!['government_photo_id', 'business_trade_licence', 'weighing_scale_certificate', 'address_proof'].includes(documentType)) throw new Error('Choose a supported verification document.')
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Choose a JPG, PNG, or PDF file under 10 MB.')
  const db = client()
  const { data: previous, error: previousError } = await db.from('recycler_documents').select('storage_path').eq('recycler_id', recyclerId).eq('document_type', documentType).maybeSingle()
  if (previousError) throw previousError
  const suffix = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'
  const path = `${recyclerId}/${documentType}-${crypto.randomUUID()}.${suffix}`
  const { error: uploadError } = await db.storage.from('recycler-documents').upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) throw uploadError
  const { data, error } = await db.from('recycler_documents').upsert({ recycler_id: recyclerId, document_type: documentType, storage_path: path, review_status: 'pending', reviewer_id: null, rejection_reason: null, reviewed_at: null }, { onConflict: 'recycler_id,document_type' }).select().single()
  if (error) { await db.storage.from('recycler-documents').remove([path]); throw error }
  if (previous?.storage_path) await db.storage.from('recycler-documents').remove([previous.storage_path])
  return data
}

export async function getDocumentSignedUrl(path) {
  const { data, error } = await client().storage.from('recycler-documents').createSignedUrl(path, 60)
  if (error) throw error
  return data.signedUrl
}

export async function setAccountStatus(id, status) {
  const { error } = await client().from('profiles').update({ account_status: status }).eq('id', id)
  if (error) throw error
}

export async function setReportStatus(id, status) {
  const { error } = await client().from('support_reports').update({ status }).eq('id', id)
  if (error) throw error
}

export async function createSupportReport(reporterId, subject, details) {
  const { data, error } = await client().from('support_reports').insert({ reporter_id: reporterId, subject, details }).select('id,created_at').single()
  if (error) throw error
  return data
}
