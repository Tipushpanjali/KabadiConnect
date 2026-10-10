import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, ImagePlus, Minus, Plus, X } from 'lucide-react'
import { Badge, Button, Card, PageHeader, Rating } from '../../components/ui'
import { WASTE, wasteName } from '../../data/mock'
import { fmtDate, inr, todayISO } from '../../utils'
import { Ico } from '../../utils/icons'
import { createPickupRequest, listAvailableRecyclers, uploadPickupPhoto } from '../../services/pickups'

const STEPS = ['Waste', 'Quantity', 'Photo', 'Recycler', 'Date', 'Time', 'Address', 'Review']
const SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
const days = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` })

export default function RequestPickup() {
  const [sp] = useSearchParams()
  const [recyclers, setRecyclers] = useState([])
  const [loadingRecyclers, setLoadingRecyclers] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [step, setStep] = useState(0)
  const [d, setD] = useState({
    waste: WASTE.some((w) => w.id === sp.get('waste')) ? sp.get('waste') : '', qty: 5, image: '', recyclerId: sp.get('recycler') || '',
    date: '', time: '', address: '',
  })
  const [err, setErr] = useState('')
  const [created, setCreated] = useState(null)
  const set = (patch) => { setD((x) => ({ ...x, ...patch })); setErr('') }
  const options = useMemo(() => recyclers.filter((r) => d.waste && r.accepts.includes(d.waste)), [d.waste, recyclers])
  const rec = recyclers.find((r) => r.id === d.recyclerId)
  const rate = rec && d.waste ? rec.rates[d.waste] : 0
  const value = Math.round(rate * d.qty)
  useEffect(() => {
    let active = true
    setLoadingRecyclers(true); setRequestError('')
    listAvailableRecyclers(d.waste || undefined).then((rows) => { if (active) setRecyclers(rows) })
      .catch((error) => { if (active) setRequestError(error.message || 'Could not load available recyclers.') })
      .finally(() => { if (active) setLoadingRecyclers(false) })
    return () => { active = false }
  }, [d.waste])

  const validate = () => {
    if (step === 0 && !d.waste) return 'Choose a waste category to continue.'
    if (step === 1 && !(d.qty > 0 && d.qty <= 500)) return 'Enter a quantity between 0.5 and 500 kg.'
    if (step === 3 && !d.recyclerId) return 'Select a recycler to continue.'
    if (step === 4 && !d.date) return 'Pick a pickup date.'
    if (step === 5 && !d.time) return 'Pick a time slot.'
    if (step === 6 && d.address.trim().length < 10) return 'Enter a full pickup address (at least 10 characters).'
    return ''
  }
  const next = () => { const e = validate(); if (e) return setErr(e); if (step === 0 && d.recyclerId && !options.some((r) => r.id === d.recyclerId)) set({ recyclerId: '' }); setStep((s) => s + 1) }
  const photo = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return setErr('Please choose an image file.')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 5 * 1024 * 1024) return setErr('Choose a JPG, PNG, or WebP photo under 5 MB.')
    setPhotoFile(f)
    const r = new FileReader()
    r.onload = () => set({ image: r.result })
    r.readAsDataURL(f)
  }
  const confirm = async () => {
    setBusy(true); setRequestError('')
    try {
      const imagePath = await uploadPickupPhoto(photoFile)
      const time = new Date(`1970-01-01 ${d.time}`).toTimeString().slice(0, 8)
      const row = await createPickupRequest({ recyclerId: d.recyclerId, category: d.waste, quantity: Number(d.qty), scheduledAt: new Date(`${d.date}T${time}`).toISOString(), address: { label: 'Pickup address', address_line: d.address.trim() }, imagePath })
      const item = Array.isArray(row) ? row[0] : row
      setCreated({ id: item.id, reference: item.public_reference })
    } catch (error) { setRequestError(error.message || 'Pickup request failed. Please review the details and retry.') }
    finally { setBusy(false) }
  }

  if (created) return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg py-10 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ok/15 text-ok shadow-glow"><CheckCircle2 size={52} /></motion.div>
      <h1 className="mt-6 text-3xl font-bold">Pickup requested</h1>
      <p className="mt-2 text-muted">Request <span className="font-semibold text-accent">{created.reference}</span> was sent to {rec?.business} for {fmtDate(d.date)} at {d.time}.</p>
      <Card className="mt-6 text-left text-sm">
        <div className="flex justify-between py-1"><span className="text-muted">Waste</span><span>{d.qty} kg {wasteName(d.waste)}</span></div>
        <div className="flex justify-between py-1"><span className="text-muted">Estimated value</span><span className="font-semibold text-accent">{inr(value)}</span></div>
        <div className="flex justify-between py-1"><span className="text-muted">Status</span><Badge tone="warn">Requested</Badge></div>
      </Card>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><Button to={`/user/pickups/${created.id}`}>Track pickup</Button><Button variant="outline" onClick={() => { setCreated(null); setStep(0); setD({ ...d, waste: '', recyclerId: '', date: '', time: '', image: '' }); setPhotoFile(null) }}>Request another</Button></div>
    </motion.div>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Request a pickup" subtitle={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
      <ol className="mb-6 flex items-center gap-1" aria-label="Progress">
        {STEPS.map((s, i) => <li key={s} className="flex flex-1 items-center gap-1" aria-current={i === step ? 'step' : undefined}><span className={`h-1.5 flex-1 rounded-full transition ${i <= step ? 'bg-gradient-to-r from-accent to-primary' : 'bg-line'}`} /><span className="sr-only">{s}</span></li>)}
      </ol>
      <Card className="min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
            {step === 0 && (<>
              <h2 className="mb-4 font-semibold">What are you recycling?</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {WASTE.map((w) => <button key={w.id} onClick={() => set({ waste: w.id })} aria-pressed={d.waste === w.id} className={`rounded-2xl border p-4 text-left transition ${d.waste === w.id ? 'border-accent bg-accent/10 shadow-glow' : 'border-line hover:border-accent/40'}`}><Ico name={w.icon} size={24} className="text-accent" /><p className="mt-2 font-semibold">{w.name}</p><p className="text-xs text-muted">{w.tip}</p><p className="mt-2 text-xs text-accent">from {inr(w.rate)}/kg</p></button>)}
              </div>
            </>)}
            {step === 1 && (<>
              <h2 className="mb-4 font-semibold">About how much {wasteName(d.waste).toLowerCase()} do you have?</h2>
              <div className="flex items-center justify-center gap-4 py-6">
                <Button variant="outline" aria-label="Decrease quantity" onClick={() => set({ qty: Math.max(0.5, Number(d.qty) - 0.5) })}><Minus size={18} /></Button>
                <div className="text-center"><input aria-label="Quantity in kilograms" type="number" min="0.5" max="500" step="0.5" value={d.qty} onChange={(e) => set({ qty: e.target.value })} className="input w-32 text-center font-display text-3xl font-bold" /><p className="mt-1 text-sm text-muted">kilograms</p></div>
                <Button variant="outline" aria-label="Increase quantity" onClick={() => set({ qty: Number(d.qty) + 0.5 })}><Plus size={18} /></Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">{[2, 5, 10, 20].map((q) => <button key={q} onClick={() => set({ qty: q })} className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-accent/50">{q} kg</button>)}</div>
              <p className="mt-4 text-center text-xs text-muted">An estimate is fine. The recycler weighs it at your door.</p>
            </>)}
            {step === 2 && (<>
              <h2 className="mb-1 font-semibold">Add a photo <span className="text-sm font-normal text-muted">(optional)</span></h2>
              <p className="mb-4 text-sm text-muted">A photo helps the recycler prepare. The image stays in your browser.</p>
              {d.image ? (
                <div className="relative w-fit"><img src={d.image} alt="Your uploaded waste" className="h-52 rounded-2xl border border-line object-cover" /><button onClick={() => set({ image: '' })} aria-label="Remove photo" className="absolute right-2 top-2 rounded-full bg-bg/80 p-1.5"><X size={16} /></button></div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-muted transition hover:border-accent/60 hover:text-accent"><ImagePlus size={32} /><span className="text-sm">Click to choose an image</span><input type="file" accept="image/*" onChange={photo} className="sr-only" /></label>
              )}
            </>)}
            {step === 3 && (<>
              <h2 className="mb-4 font-semibold">Choose a recycler for {wasteName(d.waste)}</h2>
              <div className="space-y-3">
                {requestError && <p role="alert" className="rounded-xl bg-bad/10 p-3 text-sm text-bad">{requestError}</p>}
                {loadingRecyclers ? <p className="text-sm text-muted">Loading verified recyclers…</p> : options.length === 0 ? <p className="text-sm text-muted">No verified recyclers currently accept this material.</p> : options.map((r) => <button key={r.id} onClick={() => set({ recyclerId: r.id })} aria-pressed={d.recyclerId === r.id} className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${d.recyclerId === r.id ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40'}`}>
                  <span><span className="flex items-center gap-2 font-semibold">{r.business}<BadgeCheck size={15} className="text-ok" aria-label="Verified" /></span><span className="mt-1 flex items-center gap-3 text-sm text-muted"><Rating value={r.rating} size={12} />{r.area} - {r.availability}</span></span>
                  <span className="text-right"><span className="block font-display text-lg font-bold text-accent">{inr(r.rates[d.waste])}/kg</span></span>
                </button>)}
              </div>
            </>)}
            {step === 4 && (<>
              <h2 className="mb-4 font-semibold">Pick a date</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{days().map((iso, i) => <button key={iso} onClick={() => set({ date: iso })} aria-pressed={d.date === iso} className={`rounded-xl border px-3 py-3 text-sm transition ${d.date === iso ? 'border-accent bg-accent/10 text-accent' : 'border-line hover:border-accent/40'}`}>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : fmtDate(iso).slice(0, 6)}<span className="block text-xs text-muted">{new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })}</span></button>)}</div>
              <div className="mt-4 max-w-xs"><label htmlFor="dd" className="label">Or choose another date</label><input id="dd" type="date" min={todayISO()} value={d.date} onChange={(e) => set({ date: e.target.value })} className="input" /></div>
            </>)}
            {step === 5 && (<>
              <h2 className="mb-4 font-semibold">Pick a time slot</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{SLOTS.map((t) => <button key={t} onClick={() => set({ time: t })} aria-pressed={d.time === t} className={`rounded-xl border px-3 py-3 text-sm transition ${d.time === t ? 'border-accent bg-accent/10 text-accent' : 'border-line hover:border-accent/40'}`}>{t}</button>)}</div>
            </>)}
            {step === 6 && (<>
              <h2 className="mb-4 font-semibold">Where should we collect from?</h2>
              <label htmlFor="addr" className="label">Pickup address</label>
              <textarea id="addr" rows={4} className="input" value={d.address} onChange={(e) => set({ address: e.target.value })} />
            </>)}
            {step === 7 && (<>
              <h2 className="mb-4 font-semibold">Review your request</h2>
              <dl className="divide-y divide-line text-sm">
                {[['Waste', `${d.qty} kg ${wasteName(d.waste)}`], ['Recycler', `${rec.business} (${inr(rate)}/kg)`], ['Date', fmtDate(d.date)], ['Time', d.time], ['Address', d.address], ['Photo', d.image ? 'Attached' : 'None']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>)}
              </dl>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-accent/10 px-4 py-3"><span className="text-sm">Estimated value</span><span className="font-display text-2xl font-bold text-accent">{inr(value)}</span></div>
              <p className="mt-2 text-xs text-muted">Final amount depends on the weight measured at pickup.</p>
            </>)}
          </motion.div>
        </AnimatePresence>
        {(err || requestError) && <p role="alert" className="mt-4 rounded-xl border border-bad/30 bg-bad/10 px-4 py-2.5 text-sm text-bad">{err || requestError}</p>}
      </Card>
      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}><ArrowLeft size={16} />Back</Button>
        {step < STEPS.length - 1 ? <Button onClick={next}>{step === 2 && !d.image ? 'Skip' : 'Continue'} <ArrowRight size={16} /></Button> : <Button onClick={confirm} disabled={busy || !rec}>{busy ? 'Submitting…' : <><Check size={16} />Confirm pickup</>}</Button>}
      </div>
    </div>
  )
}
