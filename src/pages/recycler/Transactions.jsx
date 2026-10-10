import { useMemo, useState } from 'react'
import { Button, Card, DataTable, EmptyState, PageHeader, SearchInput, SelectField, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { WASTE, wasteName } from '../../data/mock'
import { fmtDate, inr, kg } from '../../utils'

export default function Transactions() {
  const { transactions } = useApp()
  const [q, setQ] = useState('')
  const [waste, setWaste] = useState('all')
  const [status, setStatus] = useState('all')
  const all = transactions || []
  const rows = useMemo(() => all.filter((p) => (waste === 'all' || p.waste === waste) && (status === 'all' || p.paid === status) && (!q || `${p.customer} ${p.id} ${p.txn}`.toLowerCase().includes(q.toLowerCase()))), [all, q, waste, status])
  const total = rows.filter((r) => r.paid === 'Paid').reduce((s, r) => s + r.value, 0)
  const reset = () => { setQ(''); setWaste('all'); setStatus('all') }
  return (
    <div>
      <PageHeader title="Completed transactions" subtitle={`${rows.length} transactions - ${inr(total)} paid`} />
      <Card className="mb-4"><div className="grid gap-3 sm:grid-cols-3">
        <div><span className="label">Search</span><SearchInput value={q} onChange={setQ} placeholder="Customer or ID" /></div>
        <SelectField id="tw" label="Waste" value={waste} onChange={(e) => setWaste(e.target.value)}><option value="all">All</option>{WASTE.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</SelectField>
        <SelectField id="ts" label="Payment status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option>Paid</option><option>Pending</option></SelectField>
      </div></Card>
      <DataTable rows={rows} columns={[
        { key: 'txn', label: 'Transaction', render: (r) => r.txn.slice(0, 8).toUpperCase() }, { key: 'public_reference', label: 'Pickup reference' }, { key: 'waste', label: 'Waste', render: (r) => wasteName(r.waste) },
        { key: 'qty', label: 'Quantity', render: (r) => kg(r.qty) }, { key: 'value', label: 'Amount', render: (r) => <b>{inr(r.value)}</b> },
        { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) }, { key: 'paid', label: 'Status', render: (r) => <StatusBadge status={r.paid} /> },
      ]} empty={<EmptyState icon="Receipt" title="No transactions found" text="Try a different search or clear the filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />} />
    </div>
  )
}
