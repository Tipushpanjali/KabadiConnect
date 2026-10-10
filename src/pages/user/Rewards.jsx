import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Gift } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Modal, PageHeader, Progress, Tabs } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { fmtDate } from '../../utils'
import { Ico } from '../../utils/icons'

export default function Rewards() {
  const { points, pointsLog, redeemed, rewards, redeem, toast, dataLoading, dataError } = useApp()
  const [tab, setTab] = useState('Rewards')
  const [pick, setPick] = useState(null)
  const [done, setDone] = useState(null)
  const [redeeming, setRedeeming] = useState(false)
  const earned = pointsLog.filter((l) => l.pts > 0).reduce((s, l) => s + l.pts, 0)
  const next = rewards.filter((r) => r.cost > points).sort((a, b) => a.cost - b.cost)[0]
  const go = async () => { setRedeeming(true); try { const result = await redeem(pick.id, pick.requestKey); if (result) { setDone({ ...result, title: pick.title }); setPick(null) } } finally { setRedeeming(false) } }
  const mine = redeemed

  return (
    <div>
      <PageHeader title="Green Points" subtitle="Earn points for every completed pickup and redeem them for rewards." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-[#0B3040] lg:col-span-2">
          <p className="text-sm text-muted">Current balance</p>
          <motion.p key={points} initial={{ scale: 1.15, color: '#22D3EE' }} animate={{ scale: 1, color: '#ECFEFF' }} className="font-display text-5xl font-extrabold">{points.toLocaleString('en-IN')} <span className="text-lg text-muted">pts</span></motion.p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm"><span><span className="block text-muted">Total earned</span><span className="font-semibold">{earned.toLocaleString('en-IN')} pts</span></span><span><span className="block text-muted">Rewards redeemed</span><span className="font-semibold">{redeemed.length}</span></span></div>
          {next && <div className="mt-5"><div className="mb-1.5 flex justify-between text-xs text-muted"><span>Next: {next.title}</span><span>{points}/{next.cost}</span></div><Progress value={points} max={next.cost} label="Progress to next reward" /></div>}
        </Card>
        <Card><h2 className="mb-3 font-semibold">Earn Green Points</h2><p className="text-sm text-muted">Points are awarded by the server when a recycler completes a pickup. Bonus campaigns will appear here when they are configured.</p></Card>
      </div>

      <Tabs className="my-6 w-fit max-w-full" tabs={['Rewards', 'Points history', 'Redeemed']} value={tab} onChange={setTab} />
      {dataLoading && <p role="status" className="mb-3 text-sm text-muted">Loading points and rewards…</p>}
      {dataError && <p role="alert" className="mb-3 text-sm text-bad">{dataError}</p>}
      {tab === 'Rewards' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => {
            const can = points >= r.cost
            return (
              <Card key={r.id} hover className="flex flex-col">
                <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><Ico name={r.icon} size={22} /></span><Badge tone="mute">{r.type}</Badge></div>
                <h3 className="mt-4 font-semibold">{r.title}</h3><p className="text-sm text-muted">{r.partner}</p><p className="mt-2 flex-1 text-sm">{r.desc}</p>
                <div className="mt-4 flex items-center justify-between"><span className="font-display text-lg font-bold text-accent">{r.cost} pts</span><Button size="sm" variant={can ? 'primary' : 'outline'} onClick={() => (can ? setPick({ ...r, requestKey: crypto.randomUUID() }) : toast(`You need ${r.cost - points} more points`, 'error'))}>{can ? 'Redeem' : 'Locked'}</Button></div>
              </Card>
            )
          })}
          {!rewards.length && <EmptyState icon="Gift" title="No rewards are available yet" />}
        </div>
      )}
      {tab === 'Points history' && (pointsLog.length ? <Card className="!p-2"><ul className="divide-y divide-line">{pointsLog.map((l) => <li key={l.id} className="flex items-center justify-between gap-3 px-3 py-3 text-sm"><span>{l.label}<span className="block text-xs text-muted">{fmtDate(l.date)}</span></span><Badge tone={l.pts > 0 ? 'ok' : 'mute'}>{l.pts > 0 ? '+' : ''}{l.pts} pts</Badge></li>)}</ul></Card> : <EmptyState icon="Award" title="No points yet" />)}
      {tab === 'Redeemed' && (mine.length ? <div className="grid gap-4 sm:grid-cols-2">{mine.map((r) => <Card key={r.id} className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-ok/10 text-ok"><Gift size={22} /></span><div className="flex-1"><p className="font-semibold">{r.title}</p><p className="text-xs text-muted">Redeemed {fmtDate(r.date)}</p></div><Badge tone="ok">{r.status}</Badge></Card>)}</div> : <EmptyState icon="Gift" title="Nothing redeemed yet" text="Redeem a reward and it will appear here." action={<Button variant="outline" onClick={() => setTab('Rewards')}>Browse rewards</Button>} />)}

      <Modal open={!!pick} onClose={() => setPick(null)} title="Redeem reward">
        {pick && <><p className="text-sm text-muted">Spend <span className="font-semibold text-accent">{pick.cost} points</span> on <span className="text-ink">{pick.title}</span>? You will have {points - pick.cost} points left.</p><div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setPick(null)} disabled={redeeming}>Not now</Button><Button onClick={go} disabled={redeeming}>{redeeming ? 'Submitting…' : 'Confirm redeem'}</Button></div></>}
      </Modal>
      <Modal open={!!done} onClose={() => setDone(null)} title="Redemption requested">
        {done && <div className="py-2 text-center"><CheckCircle2 size={48} className="mx-auto text-ok" /><p className="mt-3 font-semibold">{done.title}</p><p className="mt-1 text-sm text-muted">Reference: <span className="rounded bg-bg px-2 py-0.5 font-mono text-accent">{done.redemption_reference}</span></p><p className="mt-1 text-xs text-muted">This is a redemption request; fulfillment is handled by the listed reward partner.</p><Button className="mt-5" onClick={() => setDone(null)}>Done</Button></div>}
      </Modal>
    </div>
  )
}
