import { Button, Card, EmptyState, PageHeader, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { fmtDate } from '../../utils'

export default function AdminReports() {
  const { reports, setReportStatus } = useApp()
  return (
    <div>
      <PageHeader title="Reports" subtitle="Issues raised by users and flagged by checks." />
      {reports.length === 0 ? <EmptyState icon="Inbox" title="No reports" /> : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-semibold">{r.title}</p><p className="text-sm text-muted">{r.by} reported {r.against} - {fmtDate(r.date)}</p><p className="mt-1 max-w-2xl text-sm">{r.details}</p></div>
              <div className="flex items-center gap-3"><StatusBadge status={r.status} />
                {r.status === 'Open' && <Button size="sm" variant="outline" onClick={() => setReportStatus(r.id, 'Investigating')}>Investigate</Button>}
                {r.status !== 'Resolved' && <Button size="sm" onClick={() => setReportStatus(r.id, 'Resolved')}>Resolve</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
