import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Badge, Button, Card, PageHeader, Rating, StatusBadge, EmptyState } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { getDocumentSignedUrl } from '../../services/appData'

export default function AdminRecyclers() {
  const { adminVerif, decideVerification, recyclers } = useApp()
  const [links, setLinks] = useState({})
  const [linkError, setLinkError] = useState('')
  const openDocument = async (row) => {
    setLinkError('')
    try { const url = await getDocumentSignedUrl(row.storage_path); setLinks((old) => ({ ...old, [row.id]: url })) }
    catch (error) { setLinkError(error.message || 'Could not create a private document link.') }
  }
  return (
    <div>
      <PageHeader title="Recyclers" subtitle="Review verification requests and see active recyclers." />
      <h2 className="mb-3 font-semibold">Verification requests</h2>
      {linkError && <p role="alert" className="mb-3 text-sm text-bad">{linkError}</p>}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {adminVerif.map((v) => (
          <Card key={v.id}>
            <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{v.business}</p><p className="text-sm text-muted">{v.name} - {v.area}</p></div><StatusBadge status={v.status} /></div>
            <p className="mt-3 text-sm text-muted">Document: {v.docs}</p>
            <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => openDocument(v)}>Create private view link</Button>{links[v.id] && <a className="self-center text-sm text-accent underline" href={links[v.id]} target="_blank" rel="noreferrer">Open (expires shortly)</a>}</div>
            {v.status === 'Pending' && <div className="mt-4 flex gap-2"><Button size="sm" variant="success" onClick={() => decideVerification(v.id, 'Approved')}>Approve document</Button><Button size="sm" variant="danger" onClick={() => decideVerification(v.id, 'Rejected')}>Reject document</Button></div>}
          </Card>
        ))}
      </div>
      <h2 className="mb-3 font-semibold">All recyclers</h2>
      {recyclers.length ? <div className="grid gap-3 md:grid-cols-2">{recyclers.map((r) => <Card key={r.id} className="flex items-center justify-between gap-3 !p-4"><div><p className="font-medium">{r.business_name || 'Business name not set'}</p><p className="text-xs text-muted">{r.service_areas?.join(', ') || 'Service area not set'}</p></div><div className="flex items-center gap-3"><Rating value={r.average_rating} />{r.verification_status === 'verified' ? <Badge tone="ok"><BadgeCheck size={12} />Verified</Badge> : <Badge tone="warn">{r.verification_status}</Badge>}</div></Card>)}</div> : <EmptyState icon="Recycle" title="No recycler profiles" />}
    </div>
  )
}
