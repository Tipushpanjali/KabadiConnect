import { Link } from 'react-router-dom'
import { Award, CheckCircle2, Gift, Leaf, PackagePlus, Search, Trophy, Wallet, ArrowRight } from 'lucide-react'
import { Badge, Button, Card, DashboardSkeleton, EmptyState, PageHeader, Stat, StatusBadge } from '../../components/ui'
import Journey, { journeyPct } from '../../components/Journey'
import { useApp } from '../../context/AppContext'
import { recyclerById, wasteName } from '../../data/mock'
import { fmtDate, inr, kg } from '../../utils'
import useLoading from '../../hooks/useLoading'
import { Ico } from '../../utils/icons'
import { INDIVIDUALS } from '../../data/mock'

export default function Dashboard() {
  const { session, myPickups, impact, points, pointsLog } = useApp()
  const loading = useLoading()
  if (loading) return <DashboardSkeleton />
  const current = myPickups.find((p) => !['Completed', 'Cancelled', 'Rejected', 'Requested'].includes(p.status)) || myPickups.find((p) => p.status === 'Requested')
  const rank = INDIVIDUALS.filter((i) => i.points > points).length + 1
  const recent = myPickups.slice(0, 4)
  return (
    <div>
      <PageHeader title={`Hello, ${session.name.split(' ')[0]}`} subtitle="Here is how your recycling is going." actions={<Button to="/user/request-pickup"><PackagePlus size={16} />Request pickup</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Recycle" label="Total waste recycled" value={kg(impact.kg)} sub="Completed pickups" to="/user/impact" />
        <Stat icon="Wallet" label="Total earnings" value={inr(impact.value)} sub="Paid by recyclers" to="/user/history" />
        <Stat icon="Award" label="Green Points" value={points.toLocaleString('en-IN')} sub={`Rank #${rank} on leaderboard`} to="/user/rewards" />
        <Stat icon="CheckCircle2" label="Completed pickups" value={impact.count} sub={`${myPickups.length} total requests`} to="/user/pickups" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Current pickup</h2>{current && <StatusBadge status={current.status} />}</div>
          {current ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><Ico name={['paper','cardboard','plastic','metal','glass','ewaste'].includes(current.waste) ? ({ paper: 'FileText', cardboard: 'Box', plastic: 'CupSoda', metal: 'Wrench', glass: 'GlassWater', ewaste: 'Smartphone' })[current.waste] : 'Recycle'} size={22} /></span>
                  <div><p className="font-semibold">{current.qty} kg {wasteName(current.waste)}</p><p className="text-sm text-muted">{current.id} - {recyclerById(current.recyclerId)?.business} - {fmtDate(current.date)}, {current.time}</p></div></div>
                <p className="font-display text-xl font-bold text-accent">{inr(current.value)}</p>
              </div>
              <div className="mt-6"><Journey status={current.status} orientation="horizontal" /><p className="mt-3 text-xs text-muted">Journey progress: {journeyPct(current.status)}%</p></div>
              <Button to={`/user/pickups/${current.id}`} variant="outline" className="mt-5">View journey <ArrowRight size={16} /></Button>
            </>
          ) : <EmptyState icon="Package" title="No active pickup" text="Request a pickup and track it here." action={<Button to="/user/request-pickup">Request pickup</Button>} />}
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Quick actions</h2>
          <div className="grid gap-2">
            {[[Search, 'Find a recycler', '/user/find-recycler'], [Gift, 'Redeem rewards', '/user/rewards'], [Leaf, 'View my impact', '/user/impact'], [Trophy, 'Leaderboard', '/user/leaderboard']].map(([Ic, l, to]) => (
              <Link key={l} to={to} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm transition hover:border-accent/50 hover:bg-accent/5"><Ic size={18} className="text-accent" aria-hidden="true" />{l}<ArrowRight size={14} className="ml-auto text-muted" /></Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Recent pickups</h2><Link to="/user/pickups" className="text-sm text-accent hover:underline">See all</Link></div>
          {recent.length ? <ul className="divide-y divide-line">{recent.map((p) => <li key={p.id}><Link to={`/user/pickups/${p.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-accent"><span>{p.qty} kg {wasteName(p.waste)}<span className="block text-xs text-muted">{p.id} - {fmtDate(p.date)}</span></span><StatusBadge status={p.status} /></Link></li>)}</ul> : <EmptyState icon="Package" title="No pickups yet" />}
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Recent activity</h2><Link to="/user/rewards" className="text-sm text-accent hover:underline">Points history</Link></div>
          <ul className="divide-y divide-line">{pointsLog.slice(0, 5).map((l) => <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{l.label}<span className="block text-xs text-muted">{fmtDate(l.date)}</span></span><Badge tone={l.pts > 0 ? 'ok' : 'mute'}>{l.pts > 0 ? '+' : ''}{l.pts} pts</Badge></li>)}</ul>
        </Card>
      </div>
    </div>
  )
}
