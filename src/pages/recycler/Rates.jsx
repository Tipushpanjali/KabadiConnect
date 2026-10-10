import { Card, PageHeader, Toggle } from '../../components/ui'
import { Button } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { WASTE } from '../../data/mock'
import { Ico } from '../../utils/icons'
import { Minus, Plus, RotateCcw } from 'lucide-react'

export default function Rates() {
  const { rates, setRate, dataLoading, dataError } = useApp()
  return (
    <div>
      <PageHeader title="Categories & rates" subtitle="Set your real rate per kilogram. Changes save as you edit." />
      {dataLoading && <p role="status" className="mb-3 text-sm text-muted">Loading rates…</p>}
      {dataError && <p role="alert" className="mb-3 text-sm text-bad">{dataError}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {WASTE.map((w) => {
          const r = rates[w.id]
          return (
            <Card key={w.id} className={r.active ? '' : 'opacity-60'}>
              <div className="flex items-center justify-between"><span className="flex items-center gap-3 font-semibold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><Ico name={w.icon} size={20} /></span>{w.name}</span><span className="text-xs text-muted">Your current offer</span></div>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" aria-label={`Decrease ${w.name} rate`} onClick={() => setRate(w.id, { rate: Math.max(1, r.rate - 1) })}><Minus size={14} /></Button>
                <label className="text-center"><span className="sr-only">{w.name} rate per kg</span><input type="number" min="1" value={r.rate} onChange={(e) => setRate(w.id, { rate: Math.max(0, Number(e.target.value)) })} className="input w-24 text-center font-display text-2xl font-bold" /><span className="text-xs text-muted">{'\u20B9'} per kg</span></label>
                <Button variant="outline" size="sm" aria-label={`Increase ${w.name} rate`} onClick={() => setRate(w.id, { rate: r.rate + 1 })}><Plus size={14} /></Button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-1"><Toggle label="Accepting" checked={r.active} onChange={(v) => setRate(w.id, { active: v })} /><button onClick={() => setRate(w.id, { rate: 0, active: false })} className="flex items-center gap-1 text-xs text-muted hover:text-accent"><RotateCcw size={12} />Disable offer</button></div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
