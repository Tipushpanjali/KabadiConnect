import { Crown, Flag } from 'lucide-react'
import { Badge, Card, PageHeader, Progress } from '../../components/ui'
import { SOCIETIES } from '../../data/mock'
import { num } from '../../utils'

export default function Challenge() {
  const list = [...SOCIETIES].sort((a, b) => b.kg - a.kg)
  const max = list[0].kg
  return (
    <div>
      <PageHeader title="Green Society Challenge" subtitle="Season ends 31 December 2026. Rankings update as pickups complete." />
      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-card to-[#0B3040]">
        <div className="flex items-center gap-4"><Crown size={36} className="text-warn" aria-hidden="true" /><div><p className="text-sm text-muted">Currently leading</p><p className="font-display text-2xl font-bold">{list[0].name}</p></div></div>
        <div className="text-right"><p className="font-display text-3xl font-extrabold text-accent">{num(list[0].kg)} kg</p><p className="text-sm text-muted">season total</p></div>
      </Card>
      <ol className="space-y-4">
        {list.map((s, i) => (
          <li key={s.id}>
            <Card className={s.mine ? '!border-accent/60 shadow-glow' : ''}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 font-display text-lg font-bold text-accent">{i + 1}</span><div><p className="font-semibold">{s.name} {s.mine && <Badge className="ml-1">Your society</Badge>}</p><p className="text-xs text-muted">{s.area} - {s.households} households</p></div></div>
                <p className="font-display text-2xl font-bold">{num(s.kg)} kg</p>
              </div>
              <Progress value={s.kg} max={max} className="mt-4" label={`${s.name} season progress`} />
              <div className="mt-3 flex items-center justify-between text-xs text-muted"><span className="flex items-center gap-1"><Flag size={12} />Monthly target {num(s.month)} / {num(s.target)} kg</span><span>{Math.round(s.month / s.target * 100)}%</span></div>
              <Progress value={s.month} max={s.target} className="mt-1.5 !h-1.5" label={`${s.name} monthly target`} />
            </Card>
          </li>
        ))}
      </ol>
    </div>
  )
}
