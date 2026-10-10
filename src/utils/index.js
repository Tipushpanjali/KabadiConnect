export const ROLE_HOME = {
  user: '/user/dashboard',
  recycler: '/recycler/dashboard',
  society: '/society/dashboard',
  admin: '/admin/dashboard',
}
export const ROLE_LABEL = { user: 'User / Household', recycler: 'Recycler', society: 'Society', admin: 'Admin' }

export const inr = (n) => '\u20B9' + Math.round(Number(n) || 0).toLocaleString('en-IN')
export const kg = (n) => `${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 })} kg`
export const num = (n) => Number(n || 0).toLocaleString('en-IN')

export const fmtDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(`${iso}T00:00:00`)
  return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
export const todayISO = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const statusTone = (s) => {
  if (['Completed', 'Paid', 'Active', 'Verified', 'Resolved', 'Approved', 'Available now'].includes(s)) return 'ok'
  if (['Cancelled', 'Rejected', 'Suspended', 'Missing', 'Busy', 'Inactive'].includes(s)) return 'bad'
  if (['Requested', 'Pending', 'In review', 'Open', 'New', 'Investigating'].includes(s)) return 'warn'
  return 'info'
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim())

// Illustrative per-kg factors. These are ESTIMATES for awareness only, not audited figures.
const FACTORS = {
  paper: { co2: 0.9, water: 25, trees: 0.017 },
  cardboard: { co2: 0.8, water: 20, trees: 0.015 },
  plastic: { co2: 1.5, water: 8, trees: 0 },
  metal: { co2: 3.5, water: 12, trees: 0 },
  glass: { co2: 0.3, water: 2, trees: 0 },
  ewaste: { co2: 2.0, water: 15, trees: 0 },
}
export function estimateImpact(list) {
  const done = list.filter((p) => p.status === 'Completed')
  const out = { kg: 0, value: 0, co2: 0, water: 0, trees: 0, count: done.length, byWaste: {} }
  done.forEach((p) => {
    const f = FACTORS[p.waste] || { co2: 0.5, water: 5, trees: 0 }
    out.kg += p.qty
    out.value += p.value
    out.co2 += p.qty * f.co2
    out.water += p.qty * f.water
    out.trees += p.qty * f.trees
    out.byWaste[p.waste] = (out.byWaste[p.waste] || 0) + p.qty
  })
  return out
}

export const monthKey = (iso) => new Date(`${iso}T00:00:00`).getMonth()
export const MONTH_ORDER = [4, 5, 6, 7, 8, 9] // May..Oct
export const kgByMonth = (list) => MONTH_ORDER.map((m) => Math.round(list.filter((p) => p.status === 'Completed' && monthKey(p.date) === m).reduce((s, p) => s + p.qty, 0) * 10) / 10)
