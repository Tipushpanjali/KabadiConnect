import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Modal } from './ui'

const G = () => (
  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-lg font-bold" style={{ color: '#4285F4' }} aria-hidden="true">G</span>
)

// Simulated Google sign-in. No real Google authentication is performed.
export default function GoogleModal({ open, onClose, onSuccess, accounts }) {
  const [step, setStep] = useState('choose')
  const [who, setWho] = useState(null)
  useEffect(() => { if (open) { setStep('choose'); setWho(null) } }, [open])
  const pick = (a) => {
    setWho(a); setStep('loading')
    setTimeout(() => setStep('done'), 1100)
    setTimeout(() => onSuccess(a), 2000)
  }
  return (
    <Modal open={open} onClose={step === 'choose' ? onClose : () => {}} title="Sign in with Google (demo)">
      {step === 'choose' && (
        <div className="space-y-2">
          <p className="mb-3 text-sm text-muted">Choose an account. This is a simulated flow - nothing is sent to Google.</p>
          {accounts.map((a) => (
            <button key={a.email} onClick={() => pick(a)} className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:border-accent/60 hover:bg-accent/5">
              <G /><span><span className="block text-sm font-medium">{a.name}</span><span className="block text-xs text-muted">{a.email}</span></span>
            </button>
          ))}
        </div>
      )}
      {step === 'loading' && <div className="flex flex-col items-center gap-3 py-8" role="status"><Loader2 className="animate-spin text-accent" size={34} /><p className="text-sm text-muted">Signing in as {who?.email}...</p></div>}
      {step === 'done' && <div className="flex flex-col items-center gap-3 py-8" role="status"><CheckCircle2 className="text-ok" size={40} /><p className="font-medium">Signed in successfully</p><p className="text-sm text-muted">Taking you to your dashboard...</p></div>}
    </Modal>
  )
}
