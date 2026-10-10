import { useMemo, useState } from 'react'
import { Avatar, Button, Card, DataTable, EmptyState, PageHeader, SearchInput, SelectField, StatusBadge } from '../../components/ui'
import { HOUSEHOLDS } from '../../data/mock'

export default function Households() {
  const [q, setQ] = useState('')
  const [st, setSt] = useState('all')
  const [sort, setSort] = useState('kg')
  const rows = useMemo(() => HOUSEHOLDS.filter((h) => (st === 'all' || h.status === st) && (!q || `${h.name} ${h.flat}`.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => b[sort] - a[sort]), [q, st, sort])
  return (
    <div>
      <PageHeader title="Participating households" subtitle={`${rows.length} of ${HOUSEHOLDS.length} households`} />
      <Card className="mb-4"><div className="grid gap-3 sm:grid-cols-3">
        <div><span className="label">Search</span><SearchInput value={q} onChange={setQ} placeholder="Name or flat" /></div>
        <SelectField id="hs" label="Status" value={st} onChange={(e) => setSt(e.target.value)}><option value="all">All</option><option>Active</option><option>New</option><option>Inactive</option></SelectField>
        <SelectField id="so" label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}><option value="kg">Waste recycled</option><option value="points">Green Points</option><option value="pickups">Pickups</option></SelectField>
      </div></Card>
      <DataTable rows={rows} columns={[
        { key: 'name', label: 'Household', render: (r) => <span className="flex items-center gap-3"><Avatar name={r.name} size={32} />{r.name}<span className="text-xs text-muted">{r.flat}</span></span> },
        { key: 'kg', label: 'Recycled', render: (r) => `${r.kg} kg` }, { key: 'points', label: 'Green Points' }, { key: 'pickups', label: 'Pickups' },
        { key: 'status', label: 'Participation', render: (r) => <StatusBadge status={r.status} /> },
      ]} empty={<EmptyState icon="Package" title="No households found" text="No household matches your search or filter." action={<Button variant="outline" onClick={() => { setQ(''); setSt('all') }}>Clear filters</Button>} />} />
    </div>
  )
}
