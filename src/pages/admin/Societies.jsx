import { DataTable, EmptyState, PageHeader, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function AdminSocieties() {
  const { societies, dataLoading, dataError, refreshData } = useApp()
  return (
    <div>
      <PageHeader title="Societies" subtitle="Registered society profiles." actions={dataError && <button className="text-sm text-accent" onClick={refreshData}>Retry</button>} />
      {dataLoading ? <p role="status">Loading societies…</p> : dataError ? <p role="alert" className="text-sm text-danger">{dataError}</p> : <DataTable rows={societies} columns={[
        { key: 'name', label: 'Society', render: (r) => <b>{r.name}</b> }, { key: 'address', label: 'Address' }, { key: 'contact_email', label: 'Contact email', render: (r) => r.contact_email || '—' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'created_at', label: 'Registered', render: (r) => new Date(r.created_at).toLocaleDateString() },
      ]} empty={<EmptyState icon="Building2" title="No registered societies" text="Society registrations will appear here after manager onboarding." />} />}
    </div>
  )
}
