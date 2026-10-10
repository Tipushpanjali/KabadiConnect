import { Link } from 'react-router-dom'
import { BadgeCheck, ArrowRight } from 'lucide-react'
import { Badge, Button, Card, DashboardSkeleton, PageHeader, Rating, Stat, StatusBadge } from '../../components/ui'
import { BarChart, Donut } from '../../components/charts'
import { useApp } from '../../context/AppContext'
import { WASTE, WEEK_DAYS, wasteName } from '../../data/mock'
import { fmtDate, inr, kg } from '../../utils'

const COLORS = ['#22D3EE', '#06B6D4', '#38BDF8', '#818CF8', '#67E8F9', '#A5B4FC']
const ACTIVE = ['Accepted', 'On the Way', 'Collected', 'Sorted', 'Processing', 'Recycling']

export default function RecyclerDashboard() {
  const { session, recyclerPickups, earningsExtra, verificationStatus, transactions, recyclerProfile, dataLoading } = useApp()
  const loading = dataLoading
  if (loading) return <DashboardSkeleton />
  const pending = recyclerPickups.filter((p) => p.status === 'Requested')
  const active = recyclerPickups.filter((p) => ACTIVE.includes(p.status))
  const done = recyclerPickups.filter((p) => p.status === 'Completed')
  const byWaste = WASTE.map((w, i) => ({ name: w.name, value: recyclerPickups.filter((p) => p.waste === w.id).length, color: COLORS[i] })).filter((d) => d.value)
  const today = new Date().toISOString().slice(0, 10)
  const todayEarn = transactions.filter((t) => t.date === today).reduce((s, t) => s + t.value, 0)
  const weekly = WEEK_DAYS.map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const key = d.toISOString().slice(0, 10); return transactions.filter((t) => t.date === key).reduce((s, t) => s + t.value, 0) })
  return (
    <div>
      <PageHeader title={`Welcome, ${session.name.split(' ')[0]}`} subtitle="Your pickups and earnings today." actions={<Badge tone={verificationStatus === 'Verified' ? 'ok' : 'warn'}><BadgeCheck size={12} />{verificationStatus === 'Verified' ? 'Verified recycler' : 'Verification in review'}</Badge>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Truck" label="Today's pickups" value={active.length} sub="Accepted and in progress" to="/recycler/pickups" />
        <Stat icon="Inbox" label="Pending requests" value={pending.length} sub={pending.length ? 'Waiting for you' : 'All caught up'} to="/recycler/requests" />
        <Stat icon="CheckCircle2" label="Completed pickups" value={done.length} sub="Recent transactions" to="/recycler/transactions" />
        <Stat icon="Wallet" label="Earnings today" value={inr(todayEarn)} sub="Recorded settlements" to="/recycler/earnings" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Earnings this week</h2><Rating value={Number(recyclerProfile?.average_rating || 0)} /></div><BarChart data={weekly} labels={WEEK_DAYS} fmt={(v) => `\u20B9${v}`} /></Card>
        <Card className="lg:col-span-2"><h2 className="mb-3 font-semibold">Popular waste categories</h2><Donut data={byWaste} center={recyclerPickups.length} sub="requests" /></Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Incoming requests</h2><Link to="/recycler/requests" className="text-sm text-accent hover:underline">Manage</Link></div>
          {pending.length ? <ul className="divide-y divide-line">{pending.slice(0, 3).map((p) => <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{p.customer}<span className="block text-xs text-muted">{p.qty} kg {wasteName(p.waste)} - {fmtDate(p.date)}</span></span><span className="font-semibold text-accent">{inr(p.value)}</span></li>)}</ul> : <p className="py-6 text-center text-sm text-muted">No pending requests right now.</p>}
          <Button to="/recycler/requests" variant="outline" size="sm" className="mt-3">Review requests <ArrowRight size={14} /></Button>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Active pickups</h2><Link to="/recycler/pickups" className="text-sm text-accent hover:underline">Open</Link></div>
          {active.length ? <ul className="divide-y divide-line">{active.slice(0, 4).map((p) => <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{p.customer}<span className="block text-xs text-muted">{kg(p.qty)} {wasteName(p.waste)}</span></span><StatusBadge status={p.status} /></li>)}</ul> : <p className="py-6 text-center text-sm text-muted">No active pickups. Accept a request to begin.</p>}
        </Card>
      </div>
    </div>
  )
}
