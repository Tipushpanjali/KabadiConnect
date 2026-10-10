import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, StatusBadge, TextField } from '../../components/ui'
import Journey from '../../components/Journey'
import { useApp } from '../../context/AppContext'
import { STAGES, wasteName } from '../../data/mock'
import { fmtDate, inr } from '../../utils'

const ACTIVE = ['Accepted', 'On the Way', 'Collected', 'Sorted', 'Processing', 'Recycling']
const FIRST = { Accepted: ['Mark On the Way', 'On the Way'], 'On the Way': ['Mark Collected', 'Collected'] }

export default function ActivePickups() {
  const { recyclerPickups, setStatus } = useApp()
  const [finalQuantities, setFinalQuantities] = useState({})
  const list = recyclerPickups.filter((p) => ACTIVE.includes(p.status))
  return (
    <div>
      <PageHeader title="Active pickups" subtitle="Update each pickup as it moves along." actions={<Button to="/recycler/transactions" variant="outline" size="sm">Completed transactions</Button>} />
      {list.length === 0 ? <EmptyState icon="Truck" title="No active pickups" text="Accept a request and it will show up here." action={<Button to="/recycler/requests">View requests</Button>} /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => {
            const next = STAGES[STAGES.indexOf(p.status) + 1]
            return (
              <Card key={p.id}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{p.customer}</p><p className="text-xs text-muted">{p.id} - {fmtDate(p.date)}, {p.time}</p></div><StatusBadge status={p.status} /></div>
                <p className="mt-3 font-display text-xl font-bold">{p.qty} kg {wasteName(p.waste)} <span className="text-base text-accent">{inr(p.value)}</span></p>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted"><MapPin size={14} className="mt-0.5 shrink-0" />{p.address}</p>
                <div className="mt-5"><Journey status={p.status} orientation="horizontal" /></div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {FIRST[p.status] ? <Button size="sm" onClick={() => setStatus(p.id, FIRST[p.status][1])}>{FIRST[p.status][0]}</Button> : next === 'Completed' ? (
                    <div className="flex w-full flex-wrap items-end gap-3">
                      <TextField id={`final-${p.id}`} label="Final measured weight (kg)" type="number" min="0.1" max="10000" step="0.1" value={finalQuantities[p.id] || ''} onChange={(e) => setFinalQuantities((q) => ({ ...q, [p.id]: e.target.value }))} />
                      <Button size="sm" disabled={!Number(finalQuantities[p.id]) || Number(finalQuantities[p.id]) > 10000} onClick={async () => { const ok = await setStatus(p.id, 'Completed', Number(finalQuantities[p.id])); if (ok !== false) setFinalQuantities((q) => ({ ...q, [p.id]: '' })) }}>Complete and settle</Button>
                    </div>
                  ) : next ? <Button size="sm" onClick={() => setStatus(p.id, next)}>Next stage: {next}</Button> : null}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
