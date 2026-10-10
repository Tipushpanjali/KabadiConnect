import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, Home, Loader2, Recycle } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import { Button, TextField } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { ROLE_HOME, isEmail } from '../../utils'
import { signUp, signInWithGoogle } from '../../services/auth'

const CARDS = [
  ['user', Home, 'User / Household', 'Sell recyclables from home'],
  ['recycler', Recycle, 'Recycler', 'Collect and earn'],
  ['society', Building2, 'Society manager', 'Manage a community'],
]

export default function Register() {
  const [sp] = useSearchParams()
  const { toast } = useApp()
  const nav = useNavigate()
  const q = sp.get('role')
  const [card, setCard] = useState(['user', 'recycler', 'society'].includes(q) ? q : 'user')
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '', terms: false })
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const role = card
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!f.email.trim()) er.email = 'Enter your email address.'
    else if (!isEmail(f.email)) er.email = 'Enter a valid email, like name@example.com.'
    if (!/^[0-9+\-\s]{10,15}$/.test(f.phone.trim())) er.phone = 'Enter a 10-digit phone number.'
    if (f.password.length < 8) er.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'
    if (!f.terms) er.terms = 'Please accept the Terms & Conditions to continue.'
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    try {
      const { session } = await signUp({ email: f.email.trim(), password: f.password, fullName: f.name.trim(), phone: f.phone.trim(), role })
      toast(session ? 'Account created.' : 'Account created. Check your email to confirm it before signing in.', session ? 'success' : 'info')
      nav(session ? ROLE_HOME[role] : '/login', { replace: true })
    } catch (error) { setErr({ submit: error.message || 'Account creation failed.' }) }
    finally { setBusy(false) }
  }
  const google = async () => { setBusy(true); try { await signInWithGoogle() } catch (error) { setErr({ submit: error.message || 'Google sign in could not start.' }); setBusy(false) } }

  return (
    <AuthShell wide title="Create your account" subtitle="Pick how you will use Kabadi Connect.">
      <fieldset>
        <legend className="sr-only">Account type</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CARDS.map(([id, Ic, t, d]) => (
            <button type="button" key={id} onClick={() => setCard(id)} aria-pressed={card === id}
              className={`rounded-2xl border p-4 text-left transition ${card === id ? 'border-accent bg-accent/10 shadow-glow' : 'border-line hover:border-accent/40'}`}>
              <Ic size={22} className="text-accent" aria-hidden="true" />
              <span className="mt-2 block text-sm font-semibold">{t}</span>
              <span className="block text-xs text-muted">{d}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {err.submit && <p role="alert" className="mt-3 rounded-xl bg-bad/10 p-3 text-sm text-bad">{err.submit}</p>}
      <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField id="name" label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={err.name} />
        <TextField id="remail" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} />
        <TextField id="phone" label="Phone" type="tel" autoComplete="tel" placeholder="98100 12345" value={f.phone} onChange={set('phone')} error={err.phone} />
        <TextField id="rpass" label="Password" type="password" autoComplete="new-password" value={f.password} onChange={set('password')} error={err.password} hint="At least 8 characters" />
        <TextField id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={err.confirm} className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" checked={f.terms} onChange={set('terms')} className="mt-1 accent-cyan-400" aria-invalid={!!err.terms} />
            <span>I agree to the <Link to="/terms" className="text-accent hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.</span>
          </label>
          {err.terms && <p role="alert" className="mt-1 text-xs text-bad">{err.terms}</p>}
        </div>
        <Button type="submit" size="lg" className="sm:col-span-2" disabled={busy}>{busy ? <><Loader2 className="animate-spin" size={18} />Creating account...</> : 'Create account'}</Button>
      </form>
      <Button variant="outline" className="mt-3 w-full" onClick={google} disabled={busy}><span className="font-bold" style={{ color: '#4285F4' }}>G</span>Sign up with Google</Button>
      <p className="mt-5 text-center text-sm text-muted">Already registered? <Link to="/login" className="text-accent hover:underline">Login</Link></p>
    </AuthShell>
  )
}
