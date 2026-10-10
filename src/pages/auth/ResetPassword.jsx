import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import { Button, TextField } from '../../components/ui'
import { updatePassword } from '../../services/auth'

const strength = (p) => [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length

export default function ResetPassword() {
  const [f, setF] = useState({ p: '', c: '' })
  const [err, setErr] = useState({})
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const s = strength(f.p)
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (f.p.length < 8) er.p = 'Use at least 8 characters.'
    if (f.c !== f.p) er.c = 'Passwords do not match.'
    setErr(er)
    if (!Object.keys(er).length) {
      setBusy(true); setMessage('')
      try { await updatePassword(f.p); setDone(true) }
      catch (error) { setMessage(error.message || 'The reset link is invalid or expired. Request a new one.'); }
      finally { setBusy(false) }
    }
  }
  if (done) return (
    <AuthShell title="Password updated">
      <div className="text-center">
        <CheckCircle2 size={48} className="mx-auto text-ok" />
        <p className="mt-3 text-sm text-muted">Your password has been changed. You can now log in with it.</p>
        <Button to="/login" className="mt-6 w-full">Go to login</Button>
      </div>
    </AuthShell>
  )
  return (
    <AuthShell title="Set a new password" subtitle="Choose something you have not used before.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {message && <p role="alert" className="rounded-xl bg-bad/10 p-3 text-sm text-bad">{message}</p>}
        <div>
          <TextField id="np" label="New password" type="password" autoComplete="new-password" value={f.p} onChange={(e) => setF({ ...f, p: e.target.value })} error={err.p} />
          <div className="mt-2 flex gap-1" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < s ? (s < 3 ? 'bg-warn' : 'bg-ok') : 'bg-line'}`} />)}</div>
          <p className="mt-1 text-xs text-muted">Strength: {['Too short', 'Weak', 'Fair', 'Good', 'Strong'][s]}</p>
        </div>
        <TextField id="cp" label="Confirm new password" type="password" autoComplete="new-password" value={f.c} onChange={(e) => setF({ ...f, c: e.target.value })} error={err.c} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
      </form>
    </AuthShell>
  )
}
