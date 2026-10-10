import { requireSupabase } from '../lib/supabaseClient'

export async function getProfile(userId) {
  const { data, error } = await requireSupabase().from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp({ email, password, fullName, phone, role }) {
  if (!['user', 'recycler', 'society'].includes(role)) throw new Error('Choose a supported account type.')
  const client = requireSupabase()
  const { data, error } = await client.auth.signUp({
    email, password, options: { data: { full_name: fullName, phone, requested_role: role }, emailRedirectTo: `${window.location.origin}/login` },
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { error } = await requireSupabase().auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: `${window.location.origin}/login` },
  })
  if (error) throw error
}

export async function sendPasswordReset(email) {
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
  if (error) throw error
}

export async function updatePassword(password) {
  const { error } = await requireSupabase().auth.updateUser({ password })
  if (error) throw error
}

export async function changePassword(currentPassword, newPassword) {
  const client = requireSupabase()
  const { data, error } = await client.auth.getUser()
  if (error) throw error
  if (!data.user?.email) throw new Error('Could not verify the signed-in account.')
  const { error: verifyError } = await client.auth.signInWithPassword({ email: data.user.email, password: currentPassword })
  if (verifyError) throw new Error('Current password is incorrect.')
  return updatePassword(newPassword)
}

export async function resendConfirmation(email) {
  const { error } = await requireSupabase().auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/login` } })
  if (error) throw error
}
