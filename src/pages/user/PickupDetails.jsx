import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Progress, StatusBadge } from '../../components/ui'
import Journey, { journeyPct, stageIndex } from '../../components/Journey'
import { useApp } from '../../context/AppContext'
import { STAGES, wasteName } from '../../data/mock'
import { fmtDate, inr } from '../../utils'

export default function PickupDetails() {
  const { id } = useParams()
  const { myPickups, cancelPickup, dataLoading } = useApp()
  const p = myPickups.find((x) => x.id === id)
  if (!p && dataLoading) return <p className="p-8 text-sm text-muted">Loading pickup…</p>
  if (!p) return <EmptyState icon="Package" title="Pickup not found" text="We could not find this pickup." action={<Button to="/user/pickups">Back to my pickups</Button>} />
  const idx = stageIndex(p.status)
  const dead = ['Cancelled', 'Rejected'].includes(p.status)
  const pct = journeyPct(p.status)
  return (
    <div>
      <Link to="/user/pickups" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-accent"><ArrowLeft size={14} />My pickups</Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm text-muted">{p.public_reference}</p><h1 className="text-3xl font-bold">Your waste journey</h1></div>
        <StatusBadge status={p.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-accent/15 to-transparent p-5">
            <p className="font-display text-3xl font-extrabold">{p.qty} kg <span className="gradient-text">{wasteName(p.waste)}</span></p>
            {dead ? <p className="mt-2 text-sm text-muted">This pickup was {p.status.toLowerCase()}, so the journey did not start.</p> : (
              <div className="mt-4"><div className="mb-1.5 flex justify-between text-xs text-muted"><span>Journey progress</span><motion.span key={pct}>{pct}%</motion.span></div><Progress value={pct} label="Journey progress" /></div>
            )}
          </div>
          {dead ? <EmptyState icon="Package" title={`Pickup ${p.status.toLowerCase()}`} text="Request a new pickup any time." action={<Button to="/user/request-pickup">Request pickup</Button>} /> : (
            <>
              {idx < 3 && <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">{['Requested', 'Accepted', 'On the Way'].map((s, i) => <Badge key={s} tone={idx >= i ? 'ok' : 'mute'}>{idx > i ? '\u2713 ' : ''}{s}</Badge>)}<span className="text-muted">then collection begins</span></div>}
              <Journey status={p.status} />
            </>
          )}
        </Card>
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-3 font-semibold">Pickup details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Calendar size={16} className="text-accent" /><dd>{fmtDate(p.date)}</dd></div>
              <div className="flex items-center gap-3"><Clock size={16} className="text-accent" /><dd>{p.time}</dd></div>
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-accent" /><dd>{p.address}</dd></div>
              <div className="flex justify-between border-t border-line pt-3"><dt className="text-muted">Estimated value</dt><dd className="font-display text-lg font-bold text-accent">{inr(p.value)}</dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold">Recycler</h2>
            <p className="font-medium">{p.recycler_business}</p>
          </Card>
          {!dead && (
            <Card className="border-dashed !border-accent/40">
              <p className="text-sm font-semibold">Pickup actions</p>
              <p className="mt-1 text-xs text-muted">Your recycler updates the collection stages. You can cancel before the recycler starts travelling.</p>
              {['Requested', 'Accepted'].includes(p.status) && <Button size="sm" variant="danger" className="mt-3 w-full" onClick={() => cancelPickup(p.id)}>Cancel pickup</Button>}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
