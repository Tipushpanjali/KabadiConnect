import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import { Button, TextField } from '../../components/ui'
import { isEmail } from '../../utils'
import { sendPasswordReset } from '../../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [state, setState] = useState('form')
  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setErr('Enter the email you registered with.')
    if (!isEmail(email)) return setErr('Enter a valid email, like name@example.com.')
    setErr(''); setState('loading')
    try { await sendPasswordReset(email.trim()); setState('sent') }
    catch (error) { setErr(error.message || 'Could not send the reset email.'); setState('form') }
  }
  return (
    <AuthShell title={state === 'sent' ? 'Check your inbox' : 'Forgot password?'} subtitle={state === 'sent' ? undefined : "Enter your email and we'll send a reset link."}>
      {state === 'sent' ? (
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent"><MailCheck size={32} /></div>
          <p className="mt-4 font-medium">Reset link sent</p>
          <p className="mt-1 text-sm text-muted">We sent a password reset link to <span className="text-ink">{email}</span>. Open it on this device to choose a new password.</p>
          <button onClick={() => setState('form')} className="mt-3 text-sm text-muted hover:text-accent">Use a different email</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <TextField id="fp" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err} placeholder="you@example.com" />
          <Button type="submit" size="lg" className="w-full" disabled={state === 'loading'}>{state === 'loading' ? <><Loader2 className="animate-spin" size={18} />Sending...</> : 'Send reset link'}</Button>
        </form>
      )}
      <Link to="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-muted hover:text-accent"><ArrowLeft size={14} />Back to login</Link>
    </AuthShell>
  )
}
