import { Link } from 'react-router-dom'
import { Card, PageHeader, Stat, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { num } from '../../utils'

export default function AdminDashboard() {
  const { pickups, adminVerif, reports, adminUsers, recyclers, societies, dataLoading } = useApp()
  const pendingV = adminVerif.filter((v) => v.status === 'Pending').length
  const openR = reports.filter((r) => r.status !== 'Resolved').length
  return (
    <div>
      <PageHeader title="Admin console" subtitle="Platform overview from stored account and activity records." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Package" label="Users" value={dataLoading ? '…' : num(adminUsers.length)} to="/admin/users" />
        <Stat icon="Recycle" label="Recyclers" value={dataLoading ? '…' : num(recyclers.length)} sub={`${pendingV} awaiting verification`} to="/admin/recyclers" />
        <Stat icon="Trophy" label="Societies" value={dataLoading ? '…' : societies.length} to="/admin/societies" />
        <Stat icon="Truck" label="Pickup requests" value={dataLoading ? '…' : pickups.length} to="/admin/requests" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3"><h2 className="mb-3 font-semibold">Pickup status</h2><p className="text-sm text-muted">{pickups.filter((p) => p.status === 'Completed').length} completed from the currently loaded pickup records.</p></Card>
        <Card className="lg:col-span-2"><div className="mb-3 flex justify-between"><h2 className="font-semibold">Needs attention</h2><Link to="/admin/reports" className="text-sm text-accent hover:underline">Reports</Link></div>
          <ul className="space-y-3 text-sm"><li className="flex justify-between"><span>Verification requests</span><b className="text-warn">{pendingV}</b></li><li className="flex justify-between"><span>Open reports</span><b className="text-warn">{openR}</b></li><li className="flex justify-between"><span>Requests awaiting action</span><b>{pickups.filter((p) => p.status === 'Requested').length}</b></li></ul></Card>
      </div>
      <Card className="mt-6"><h2 className="mb-3 font-semibold">Recent reports</h2><ul className="divide-y divide-line text-sm">{reports.slice(0, 3).map((r) => <li key={r.id} className="flex items-center justify-between gap-3 py-3"><span>{r.title}<span className="block text-xs text-muted">{r.by} on {r.against}</span></span><StatusBadge status={r.status} /></li>)}</ul></Card>
    </div>
  )
}
