import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import { Button, TextField } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { ROLE_HOME, isEmail } from '../../utils'
import { resendConfirmation, signInWithGoogle } from '../../services/auth'

const ROLES = [['user', 'User'], ['recycler', 'Recycler'], ['society', 'Society'], ['admin', 'Admin']]
export default function Login() {
  const { login, logout, toast, session } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const [role, setRole] = useState('user')
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState({})
  const [banner, setBanner] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const [showResend, setShowResend] = useState(false)

  useEffect(() => { if (session?.role) go(session.role) }, [session?.role])

  const go = (r) => {
    const from = loc.state?.from
    nav(from && from.startsWith(`/${r}`) ? from : ROLE_HOME[r], { replace: true })
  }
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.email.trim()) er.email = 'Enter your email address.'
    else if (!isEmail(f.email)) er.email = 'Enter a valid email, like name@example.com.'
    if (!f.password) er.password = 'Enter your password.'
    else if (f.password.length < 6) er.password = 'Password must be at least 6 characters.'
    setErr(er); setBanner(''); setShowResend(false)
    if (Object.keys(er).length) return
    setBusy(true)
    try {
      const account = await login(f.email.trim(), f.password)
      if (account.role !== role) { await logout(); throw new Error(`This account is registered as ${account.role}. Select that role and try again.`) }
      toast('Welcome back!')
      go(account.role)
    } catch (error) { setBanner(error.message || 'Sign in failed. Check your details and try again.'); setShowResend(/not confirmed|unconfirmed/i.test(error.message || '')) }
    finally { setBusy(false) }
  }
  const google = async () => { setBanner(''); setBusy(true); try { await signInWithGoogle() } catch (e) { setBanner(e.message || 'Google sign in could not start.') ; setBusy(false) } }
  const resend = async () => { setResendBusy(true); try { await resendConfirmation(f.email.trim()); setBanner('Confirmation email sent. Check your inbox.'); setShowResend(false) } catch (e) { setBanner(e.message || 'Could not resend confirmation.') } finally { setResendBusy(false) } }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to your dashboard.">
      <fieldset className="mb-5">
        <legend className="label">Log in as</legend>
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-line bg-bg/60 p-1">
          {ROLES.map(([id, label]) => (
            <button type="button" key={id} onClick={() => setRole(id)} aria-pressed={role === id}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition sm:text-sm ${role === id ? 'bg-accent/15 text-accent' : 'text-muted hover:text-ink'}`}>{label}</button>
          ))}
        </div>
      </fieldset>
      {banner && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-bad/30 bg-bad/10 p-3 text-sm text-bad"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{banner}</div>}
      {showResend && <button type="button" onClick={resend} disabled={resendBusy} className="mb-4 text-sm text-accent hover:underline">{resendBusy ? 'Sending confirmation…' : 'Resend confirmation email'}</button>}
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="At least 6 characters" value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })} className={`input !pr-11 ${err.password ? '!border-bad' : ''}`} aria-invalid={!!err.password} aria-describedby={err.password ? 'pw-err' : undefined} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {err.password && <p id="pw-err" role="alert" className="mt-1 text-xs text-bad">{err.password}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span />
          <Link to="/forgot-password" className="text-muted hover:text-accent">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? <><Loader2 className="animate-spin" size={18} />Logging in...</> : 'Login'}</Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <Button variant="outline" className="w-full" onClick={google} disabled={busy}><span className="font-bold" style={{ color: '#4285F4' }}>G</span>Continue with Google</Button>
      <p className="mt-6 text-center text-sm text-muted">New to Kabadi Connect? <Link to="/register" className="text-accent hover:underline">Create an account</Link></p>
    </AuthShell>
  )
}
