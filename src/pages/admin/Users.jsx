import { useMemo, useState } from 'react'
import { Avatar, Button, Card, DataTable, EmptyState, PageHeader, SearchInput, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function AdminUsers() {
  const { adminUsers, toggleUser } = useApp()
  const [q, setQ] = useState('')
  const rows = useMemo(() => adminUsers.filter((u) => `${u.name} ${u.email} ${u.society}`.toLowerCase().includes(q.toLowerCase())), [adminUsers, q])
  return (
    <div>
      <PageHeader title="Users" subtitle={`${adminUsers.length} registered accounts`} />
      <SearchInput value={q} onChange={setQ} placeholder="Search users" className="mb-4 max-w-md" />
      <DataTable rows={rows} columns={[
        { key: 'name', label: 'User', render: (r) => <span className="flex items-center gap-3"><Avatar name={r.name} size={32} />{r.name}</span> },
        { key: 'role', label: 'Account type', render: (r) => r.role },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        { key: 'act', label: 'Action', render: (r) => <Button size="sm" variant={r.status === 'Active' ? 'danger' : 'success'} onClick={() => toggleUser(r.id)}>{r.status === 'Active' ? 'Suspend' : 'Reactivate'}</Button> },
      ]} empty={<EmptyState icon="Inbox" title="No users found" action={<Button variant="outline" onClick={() => setQ('')}>Clear search</Button>} />} />
    </div>
  )
}
