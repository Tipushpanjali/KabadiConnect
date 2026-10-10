import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { Avatar, Badge, Card, DashboardSkeleton, PageHeader, Progress, Stat } from '../../components/ui'
import { AreaChart } from '../../components/charts'
import { HOUSEHOLDS, MONTHS, SOCIETIES, SOCIETY_MONTHLY } from '../../data/mock'
import { num } from '../../utils'
import useLoading from '../../hooks/useLoading'

const ACTIVITY = ['Menon Family completed a 12 kg paper pickup', 'Iyer Family earned 140 Green Points', 'Joshi Family requested a plastic pickup', 'Nambiar Family joined the challenge', 'Gowda Family completed a 9 kg cardboard pickup']

export default function SocietyDashboard() {
  const loading = useLoading()
  if (loading) return <DashboardSkeleton />
  const me = SOCIETIES.find((s) => s.mine)
  const rank = [...SOCIETIES].sort((a, b) => b.kg - a.kg).findIndex((s) => s.mine) + 1
  const top = [...HOUSEHOLDS].sort((a, b) => b.kg - a.kg).slice(0, 4)
  return (
    <div>
      <PageHeader title={me.name} subtitle="Society overview - October 2026" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Package" label="Participating households" value={me.households} sub="of 240 homes" to="/society/households" />
        <Stat icon="Recycle" label="Waste recycled (season)" value={`${num(me.kg)} kg`} sub="All completed pickups" to="/society/analytics" />
        <Stat icon="Trophy" label="Society ranking" value={`#${rank}`} sub={`of ${SOCIETIES.length} societies`} to="/society/challenge" />
        <Stat icon="Award" label="Active households" value={`${Math.round(HOUSEHOLDS.filter((h) => h.status === 'Active').length / HOUSEHOLDS.length * 100)}%`} sub="Recycled this month" to="/society/households" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3"><h2 className="mb-1 font-semibold">Monthly progress</h2><p className="mb-4 text-sm text-muted">{num(me.month)} of {num(me.target)} kg target ({Math.round(me.month / me.target * 100)}%)</p><Progress value={me.month} max={me.target} label="Monthly target progress" className="mb-5" /><AreaChart data={SOCIETY_MONTHLY} labels={MONTHS} unit=" kg" height={200} /></Card>
        <Card className="lg:col-span-2"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Top contributors</h2><Link to="/society/households" className="text-sm text-accent hover:underline">All</Link></div>
          <ul className="space-y-3">{top.map((h, i) => <li key={h.id} className="flex items-center gap-3"><span className="w-5 text-sm font-bold text-muted">{i + 1}</span><Avatar name={h.name} size={34} /><span className="flex-1 text-sm">{h.name}<span className="block text-xs text-muted">{h.flat}</span></span><Badge>{h.kg} kg</Badge></li>)}</ul></Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">Recent activity</h2><ul className="divide-y divide-line text-sm">{ACTIVITY.map((a) => <li key={a} className="py-2.5 text-muted">{a}</li>)}</ul></Card>
        <Card className="bg-gradient-to-br from-card to-[#0B3040]"><Trophy className="text-accent" /><h2 className="mt-3 text-lg font-semibold">Green Society Challenge</h2><p className="mt-1 text-sm text-muted">{SOCIETIES[0].kg - me.kg > 0 ? `${num(SOCIETIES[0].kg - me.kg)} kg behind ${SOCIETIES[0].name}. Keep going!` : 'You are in the lead!'}</p><Link to="/society/challenge" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">Open challenge</Link></Card>
      </div>
    </div>
  )
}
