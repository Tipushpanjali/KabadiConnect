import { useMemo, useState } from 'react'
import { Button, DataTable, EmptyState, PageHeader, SearchInput, SelectField, StatusBadge, Card } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { STAGES, wasteName } from '../../data/mock'
import { fmtDate, inr, kg } from '../../utils'

export default function AdminRequests() {
  const { pickups } = useApp()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('all')
  const rows = useMemo(() => pickups.filter((p) => (st === 'all' || p.status === st) && (!q || `${p.public_reference} ${p.customer}`.toLowerCase().includes(q.toLowerCase()))).map((p) => ({ ...p, id: p.public_reference, recycler: p.recycler_business })), [pickups, q, st])
  return (
    <div>
      <PageHeader title="Pickup requests" subtitle={`${rows.length} requests`} />
      <Card className="mb-4"><div className="grid gap-3 sm:grid-cols-2"><div><span className="label">Search</span><SearchInput value={q} onChange={setQ} placeholder="ID or customer" /></div>
        <SelectField id="as" label="Status" value={st} onChange={(e) => setSt(e.target.value)}><option value="all">All</option>{[...STAGES, 'Cancelled', 'Rejected'].map((s) => <option key={s}>{s}</option>)}</SelectField></div></Card>
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'ID' }, { key: 'customer', label: 'Customer' }, { key: 'waste', label: 'Waste', render: (r) => `${kg(r.qty)} ${wasteName(r.waste)}` },
        { key: 'recycler', label: 'Recycler' }, { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) }, { key: 'value', label: 'Value', render: (r) => inr(r.value) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]} empty={<EmptyState icon="Package" title="No requests found" action={<Button variant="outline" onClick={() => { setQ(''); setSt('all') }}>Clear filters</Button>} />} />
    </div>
  )
}
