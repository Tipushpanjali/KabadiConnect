import { useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { Button, Card, EmptyState, Modal, PageHeader, Badge } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { wasteName } from '../../data/mock'
import { fmtDate, inr } from '../../utils'

export default function Requests() {
  const { recyclerPickups, setStatus } = useApp()
  const [view, setView] = useState(null)
  const list = recyclerPickups.filter((p) => p.status === 'Requested')
  const act = async (p, s) => { if (await setStatus(p.id, s) !== false) setView(null) }
  return (
    <div>
      <PageHeader title="Incoming requests" subtitle={`${list.length} waiting for your response`} />
      {list.length === 0 ? <EmptyState icon="Inbox" title="No pending requests" text="New pickup requests from households will appear here. Try booking one from a user account." /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => (
            <Card key={p.id} hover>
              <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{p.customer}</p><p className="text-xs text-muted">{p.public_reference}</p></div><Badge tone="warn">New request</Badge></div>
              <p className="mt-4 font-display text-2xl font-bold">{p.qty} kg <span className="gradient-text">{wasteName(p.waste)}</span></p>
              <dl className="mt-3 space-y-1.5 text-sm text-muted">
                <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /><dd>{p.address}</dd></div>
                <div className="flex items-center gap-2"><Calendar size={14} /><dd>{fmtDate(p.date)}</dd><Clock size={14} className="ml-2" /><dd>{p.time}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4"><span className="text-sm text-muted">Estimated value</span><span className="font-display text-lg font-bold text-accent">{inr(p.value)}</span></div>
              <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => setStatus(p.id, 'Accepted')}>Accept</Button><Button size="sm" variant="danger" onClick={() => setStatus(p.id, 'Rejected')}>Reject</Button><Button size="sm" variant="ghost" onClick={() => setView(p)}>View details</Button></div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={!!view} onClose={() => setView(null)} title={`Request ${view?.public_reference || ''}`}>
        {view && <>
          <dl className="divide-y divide-line text-sm">{[['Customer', view.customer], ['Waste', `${view.qty} kg ${wasteName(view.waste)}`], ['Date', fmtDate(view.date)], ['Time', view.time], ['Address', view.address], ['Estimated value', inr(view.value)]].map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl>
          {view.image && <img src={view.image} alt="Customer's waste" className="mt-3 h-40 rounded-xl object-cover" />}
          <div className="mt-5 flex justify-end gap-2"><Button variant="danger" onClick={() => act(view, 'Rejected')}>Reject</Button><Button onClick={() => act(view, 'Accepted')}>Accept request</Button></div>
        </>}
      </Modal>
    </div>
  )
}
