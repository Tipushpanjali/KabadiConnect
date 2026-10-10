import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { estimateImpact } from '../utils'
import { supabase } from '../lib/supabaseClient'
import { changePassword as changePasswordRequest, getProfile, signIn } from '../services/auth'
import { getAppData, redeemReward, reviewDocument, uploadRecyclerDocument, setAccountStatus, setNotificationRead, setReportStatus as persistReportStatus, createSupportReport, clearNotifications, transitionPickup, updateOwnProfile, updateRate, updateRecyclerSettings, saveNotificationPreferences } from '../services/appData'
import { WASTE } from '../data/mock'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
const DOCUMENTS = { government_photo_id: 'Government photo ID', business_trade_licence: 'Business or trade licence', weighing_scale_certificate: 'Weighing scale certificate', address_proof: 'Address proof' }

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState('')
  const [data, setData] = useState({ pickups: [], points: 0, pointsLog: [], redeemed: [], rewards: [], notifs: [], rates: {}, docs: [], adminUsers: [], adminVerif: [], reports: [], societies: [], recyclers: [], transactions: [], reviews: [], earningsExtra: 0, recyclerId: null, recyclerProfile: null, verificationStatus: 'Pending', address: '', preferences: null })
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((items) => [...items, { id, msg, type }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3400)
  }, [])
  const dismissToast = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), [])

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return undefined }
    let live = true
    const restore = async (authSession) => {
      if (!authSession?.user) {
        if (live) { setSession(null); setAuthLoading(false) }
        return
      }
      try {
        const profile = await getProfile(authSession.user.id)
        if (live) { setSession({ id: authSession.user.id, role: profile.role, name: profile.full_name, email: authSession.user.email, phone: profile.phone, profile }); setAuthError('') }
      } catch (error) {
        if (live) { setSession(null); setAuthError(error.message || 'Could not load your account profile.') }
      } finally { if (live) setAuthLoading(false) }
    }
    supabase.auth.getSession().then(({ data: auth }) => restore(auth.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, auth) => { setAuthLoading(true); void restore(auth) })
    return () => { live = false; listener.subscription.unsubscribe() }
  }, [])

  const refreshData = useCallback(async () => {
    if (!session) return
    setDataLoading(true); setDataError('')
    try { setData(await getAppData(session)) }
    catch (error) { setDataError(error.message || 'Could not load your account data.') }
    finally { setDataLoading(false) }
  }, [session])

  useEffect(() => {
    if (!session) {
      setData({ pickups: [], points: 0, pointsLog: [], redeemed: [], rewards: [], notifs: [], rates: {}, docs: [], adminUsers: [], adminVerif: [], reports: [], societies: [], recyclers: [], transactions: [], reviews: [], earningsExtra: 0, recyclerId: null, recyclerProfile: null, verificationStatus: 'Pending', address: '', preferences: null })
      setDataError(''); setDataLoading(false)
      return undefined
    }
    void refreshData()
    const channel = supabase?.channel(`app-data-${session.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_requests' }, () => { void refreshData() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${session.id}` }, () => { void refreshData() })
      .subscribe()
    return () => { if (channel) void supabase.removeChannel(channel) }
  }, [session, refreshData])

  const login = useCallback(async (email, password) => {
    setAuthError('')
    try {
      const { user } = await signIn(email, password)
      const profile = await getProfile(user.id)
      const next = { id: user.id, role: profile.role, name: profile.full_name, email: user.email, phone: profile.phone, profile }
      setSession(next)
      return next
    } catch (error) { setAuthError(error.message || 'Sign in failed.'); throw error }
  }, [])
  const logout = useCallback(async () => {
    if (supabase) { const { error } = await supabase.auth.signOut(); if (error) throw error }
    setSession(null)
  }, [])

  const runMutation = useCallback(async (operation, successMessage) => {
    try { const result = await operation(); await refreshData(); if (successMessage) toast(successMessage); return result }
    catch (error) { toast(error.message || 'The change could not be saved.', 'error'); return false }
  }, [refreshData, toast])
  const setStatus = useCallback((id, status, finalQuantity) => runMutation(() => transitionPickup(id, status, finalQuantity), `Pickup updated to ${status}.`), [runMutation])
  const cancelPickup = useCallback((id) => setStatus(id, 'Cancelled'), [setStatus])
  const redeem = useCallback((rewardId, key) => runMutation(() => redeemReward(rewardId, key), 'Reward redemption requested.'), [runMutation])
  const markRead = useCallback((id) => runMutation(() => setNotificationRead(id), null), [runMutation])
  const markAllRead = useCallback(() => runMutation(async () => { for (const item of data.notifs.filter((n) => !n.read)) await setNotificationRead(item.id) }, null), [data.notifs, runMutation])
  const clearNotifs = useCallback(() => runMutation(clearNotifications, null), [runMutation])
  const setRate = useCallback((category, patch) => {
    if (!data.recyclerId) return toast('Recycler profile is not available.', 'error')
    return runMutation(() => updateRate(data.recyclerId, category, { ...data.rates[category], ...patch }), 'Rate saved.')
  }, [data.recyclerId, data.rates, runMutation, toast])
  const updateProfile = useCallback((patch) => {
    if (!session) return
    return runMutation(async () => {
      const profile = await updateOwnProfile(session.id, patch)
      setSession((old) => ({ ...old, name: profile.full_name, phone: profile.phone, profile }))
    }, 'Profile updated.')
  }, [session, runMutation])
  const updatePreferences = useCallback((prefs) => {
    if (!session) return
    return runMutation(() => saveNotificationPreferences(session.id, prefs), 'Notification preferences saved.')
  }, [session, runMutation])
  const changePassword = useCallback((currentPassword, newPassword) => runMutation(() => changePasswordRequest(currentPassword, newPassword), 'Password updated.'), [runMutation])
  const decideVerification = useCallback((id, status) => {
    if (!session) return
    const dbStatus = status === 'Approved' ? 'approved' : 'rejected'
    return runMutation(() => reviewDocument(id, dbStatus, session.id), `Document ${status.toLowerCase()}.`)
  }, [session, runMutation])
  const uploadDocument = useCallback((type, file) => {
    if (!data.recyclerId) { toast('Recycler profile is not available.', 'error'); return Promise.resolve(false) }
    return runMutation(() => uploadRecyclerDocument(data.recyclerId, type, file), 'Document uploaded for review.')
  }, [data.recyclerId, runMutation, toast])
  const updateRecycler = useCallback((patch) => {
    if (!data.recyclerId) { toast('Recycler profile is not available.', 'error'); return Promise.resolve(false) }
    return runMutation(() => updateRecyclerSettings(data.recyclerId, patch), 'Recycler settings saved.')
  }, [data.recyclerId, runMutation, toast])
  const toggleUser = useCallback((id) => {
    const current = data.adminUsers.find((user) => user.id === id)
    if (!current) return
    const status = current.status === 'Active' ? 'suspended' : 'active'
    return runMutation(() => setAccountStatus(id, status), 'Account status updated.')
  }, [data.adminUsers, runMutation])
  const updateReport = useCallback((id, status) => runMutation(() => persistReportStatus(id, status.toLowerCase()), 'Report status updated.'), [runMutation])
  const createReport = useCallback((subject, details) => {
    if (!session) return Promise.resolve(false)
    return runMutation(() => createSupportReport(session.id, subject, details), 'Your report was submitted.')
  }, [session, runMutation])

  const pickups = data.pickups || []
  const myPickups = useMemo(() => pickups.filter((p) => p.userId === session?.id), [pickups, session?.id])
  const recyclerPickups = useMemo(() => session?.role === 'recycler' ? pickups : [], [pickups, session?.role])
  const impact = useMemo(() => estimateImpact(myPickups), [myPickups])
  const points = data.points || 0
  const pointsLog = data.pointsLog || []
  const redeemed = data.redeemed || []
  const notifs = data.notifs || []
  const unread = notifs.filter((item) => !item.read).length
  const profile = { ...(session?.profile || {}), name: session?.name || '', email: session?.email || '', phone: session?.phone || '', address: data.address || '' }
  const preferences = data.preferences ? { pickup: data.preferences.pickup_updates, points: data.preferences.points, society: data.preferences.society_challenges, promo: data.preferences.promotions } : { pickup: true, points: true, society: true, promo: false }
  const docs = Object.entries(DOCUMENTS).map(([type, name]) => {
    const existing = data.docs.find((item) => item.document_type === type)
    return existing ? { ...existing, name, status: existing.review_status === 'approved' ? 'Verified' : existing.review_status === 'rejected' ? 'Rejected' : 'Pending' } : { id: type, document_type: type, name, status: 'Missing' }
  })
  const rates = Object.fromEntries(WASTE.map((category) => [category.id, data.rates[category.id] || { rate: 0, active: false }]))
  const verificationStatus = data.verificationStatus || 'Pending'

  const value = {
    session, authLoading, authError, dataLoading, dataError, refreshData, login, logout,
    pickups, myPickups, recyclerPickups, transactions: data.transactions || [], reviews: data.reviews || [], impact, points, pointsLog, redeemed, rewards: data.rewards || [],
    notifs, unread, rates, earningsExtra: data.earningsExtra || 0, profile, toasts, docs, adminVerif: data.adminVerif || [],
    adminUsers: data.adminUsers || [], reports: data.reports || [], societies: data.societies || [], recyclers: data.recyclers || [], verificationStatus,
    toast, dismissToast, setStatus, cancelPickup, redeem, markRead, markAllRead, clearNotifs, setRate, updateProfile, preferences, updatePreferences, changePassword,
    decideVerification, uploadDocument, updateRecycler, recyclerProfile: data.recyclerProfile, toggleUser, setReportStatus: updateReport, createReport,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
