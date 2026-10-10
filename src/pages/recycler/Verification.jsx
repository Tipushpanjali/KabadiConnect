import { BadgeCheck, FileCheck, Info, Upload } from 'lucide-react'
import { Badge, Button, Card, PageHeader, Progress, StatusBadge } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function Verification() {
  const { docs, verificationStatus, uploadDocument, dataLoading, dataError } = useApp()
  const verified = docs.filter((d) => d.status === 'Verified').length
  const complete = Math.round((verified / docs.length) * 100)
  const upload = (doc, event) => {
    const file = event.target.files?.[0]
    if (file) uploadDocument(doc.document_type, file)
    event.target.value = ''
  }
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile & verification" subtitle="Verified recyclers get more requests and customer trust." />
      <div className="mb-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm"><Info size={16} className="mt-0.5 shrink-0 text-accent" />Upload the requested files for administrator review. Documents are stored privately and only signed links are provided to authorized reviewers.</div>
      {dataLoading && <p role="status" className="mb-3 text-sm text-muted">Loading verification records…</p>}
      {dataError && <p role="alert" className="mb-3 text-sm text-bad">{dataError}</p>}
      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4"><span className={`grid h-14 w-14 place-items-center rounded-2xl ${verificationStatus === 'Verified' ? 'bg-ok/15 text-ok' : 'bg-warn/15 text-warn'}`}><BadgeCheck size={30} /></span><div><p className="text-sm text-muted">Verification status</p><p className="font-display text-xl font-bold">{verificationStatus}</p></div></div>
        {verificationStatus === 'Verified' && <Badge tone="ok"><BadgeCheck size={12} />Verified badge active</Badge>}
      </Card>
      <Card className="mb-6"><div className="mb-2 flex justify-between text-sm"><span className="font-medium">Profile completeness</span><span className="text-accent">{complete}%</span></div><Progress value={complete} label="Profile completeness" /></Card>
      <Card>
        <h2 className="mb-2 font-semibold">Documents</h2>
        <ul className="divide-y divide-line">
          {docs.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <span className="flex items-center gap-3 text-sm"><FileCheck size={18} className="text-accent" aria-hidden="true" />{d.name}</span>
              <span className="flex items-center gap-2"><StatusBadge status={d.status} />
                {d.status !== 'Verified' && <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:border-accent/50"><Upload size={14} />{d.status === 'Missing' ? 'Upload' : 'Replace'}<input className="sr-only" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => upload(d, event)} /></label>}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
