import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, DataTable, EmptyState, PageHeader, SearchInput, SelectField, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { WASTE, recyclerById, wasteName } from '../../data/mock'
import { fmtDate, inr, kg } from '../../utils'

export default function History() {
  const { myPickups } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [waste, setWaste] = useState('all')
  const [status, setStatus] = useState('all')
  const [year, setYear] = useState('all')
  const hist = myPickups.filter((p) => ['Completed', 'Cancelled', 'Rejected'].includes(p.status))
  const rows = useMemo(() => hist.filter((p) =>
    (waste === 'all' || p.waste === waste) && (status === 'all' || p.status === status) && (year === 'all' || p.date.startsWith(year)) &&
    (!q || `${p.id} ${wasteName(p.waste)} ${recyclerById(p.recyclerId)?.business}`.toLowerCase().includes(q.toLowerCase()))
  ).map((p) => ({ ...p, recycler: recyclerById(p.recyclerId)?.business })), [hist, q, waste, status, year])

  const done = myPickups.filter((p) => p.status === 'Completed')
  const sum = (list) => ({ kg: list.reduce((s, p) => s + p.qty, 0), value: list.reduce((s, p) => s + p.value, 0), n: list.length })
  const month = sum(done.filter((p) => p.date.startsWith('2026-10')))
  const yearS = sum(done.filter((p) => p.date.startsWith('2026')))
  const all = sum(done)
  const reset = () => { setQ(''); setWaste('all'); setStatus('all'); setYear('all') }

  return (
    <div>
      <PageHeader title="Recycling history" subtitle="Everything you have recycled with Kabadi Connect." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[['This month', month], ['This year', yearS], ['All time', all]].map(([l, s]) => (
          <Card key={l}><p className="text-sm text-muted">{l}</p><p className="mt-1 font-display text-2xl font-bold">{kg(s.kg)}</p><p className="text-sm text-muted">{s.n} pickups - {inr(s.value)} earned</p></Card>
        ))}
      </div>
      <Card className="mb-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div><span className="label">Search</span><SearchInput value={q} onChange={setQ} placeholder="ID, waste or recycler" /></div>
        <SelectField id="hw" label="Waste type" value={waste} onChange={(e) => setWaste(e.target.value)}><option value="all">All types</option>{WASTE.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</SelectField>
        <SelectField id="hs" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option>Completed</option><option>Cancelled</option><option>Rejected</option></SelectField>
        <SelectField id="hy" label="Year" value={year} onChange={(e) => setYear(e.target.value)}><option value="all">All years</option><option value="2026">2026</option></SelectField>
      </div></Card>
      <DataTable rows={rows} onRow={(r) => nav(`/user/pickups/${r.id}`)}
        columns={[
          { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'waste', label: 'Waste', render: (r) => wasteName(r.waste) },
          { key: 'qty', label: 'Quantity', render: (r) => kg(r.qty) },
          { key: 'recycler', label: 'Recycler' },
          { key: 'value', label: 'Value', render: (r) => (r.status === 'Completed' ? inr(r.value) : '-') },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        empty={<EmptyState icon="Inbox" title="No matching history" text="No pickups match these filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />} />
    </div>
  )
}
