import { useEffect, useState } from 'react'
import { Crown, Medal, Trophy } from 'lucide-react'
import { Avatar, Button, Card, EmptyState, PageHeader, Progress, Tabs, Badge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { getLeaderboard } from '../../services/appData'

function Podium({ rows }) {
  const order = [rows[1], rows[0], rows[2]].filter(Boolean)
  const h = { 0: 'h-28', 1: 'h-40', 2: 'h-20' }
  const pos = rows.length >= 3 ? [2, 1, 3] : [2, 1, 3]
  return (
    <div className="grid grid-cols-3 items-end gap-3 sm:gap-6">
      {order.map((r, i) => (
        <div key={r.id} className="flex flex-col items-center text-center">
          {pos[i] === 1 && <Crown className="mb-1 text-warn" size={22} aria-hidden="true" />}
          <Avatar name={r.name} size={pos[i] === 1 ? 72 : 56} className={r.you ? 'ring-2 ring-ink' : ''} />
          <p className="mt-2 line-clamp-1 text-sm font-semibold">{r.name}</p>
          <p className="text-xs text-muted">{r.sub}</p>
          <div className={`mt-3 flex w-full flex-col items-center justify-start rounded-t-2xl border border-accent/30 bg-gradient-to-b from-accent/25 to-card pt-3 ${h[i]}`}>
            <span className="font-display text-2xl font-extrabold text-accent">{pos[i]}</span>
            <span className="text-xs">{r.metric}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Leaderboard() {
  const { session } = useApp()
  const [tab, setTab] = useState('Individual')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let live = true; setLoading(true); setError(''); getLeaderboard(tab).then((items) => { if (live) setRows(items) }).catch((e) => { if (live) setError(e.message || 'Could not load leaderboard.') }).finally(() => { if (live) setLoading(false) }); return () => { live = false } }, [tab])
  const top = rows[0]?.value || 1
  return (
    <div className={session ? '' : 'mx-auto max-w-4xl px-4 py-10 sm:px-6'}>
      <PageHeader title="Leaderboard" subtitle="Rankings update as pickups are completed." actions={<Tabs tabs={['Individual', 'Recycler', 'Society']} value={tab} onChange={setTab} />} />
      {error && <Card role="alert" className="mb-4"><p className="text-sm text-danger">{error}</p><Button className="mt-3" onClick={() => { setLoading(true); getLeaderboard(tab).then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false)) }} variant="outline">Retry</Button></Card>}
      {loading && <Card role="status">Loading leaderboard…</Card>}
      {!loading && !error && rows.length === 0 && <Card><EmptyState icon="Trophy" title="No rankings yet" text="Rankings appear when verified accounts complete pickups and earn points." /></Card>}
      <Card className="mb-6 bg-gradient-to-b from-card to-bg px-4 pb-0 pt-8 sm:px-10"><Podium rows={rows.slice(0, 3)} /></Card>
      <Card className="!p-2">
        <ol>
          {rows.slice(3).map((r, i) => (
            <li key={r.id} className={`flex items-center gap-4 rounded-xl px-3 py-3 ${r.you ? 'bg-accent/10 ring-1 ring-accent/40' : ''}`}>
              <span className="w-7 text-center font-display font-bold text-muted">{i + 4}</span>
              <Avatar name={r.name} size={38} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}{r.you && <Badge className="ml-2">You</Badge>}</p>
                <Progress value={r.value} max={top} className="mt-1.5 !h-1.5" label={`${r.name} relative score`} />
              </div>
              <div className="text-right"><p className="text-sm font-semibold">{r.metric}</p><p className="text-xs text-muted">{r.extra}</p></div>
            </li>
          ))}
        </ol>
      </Card>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Trophy size={14} aria-hidden="true" /><Medal size={14} aria-hidden="true" />Complete a pickup as a user and watch your own rank move.</p>
    </div>
  )
}
