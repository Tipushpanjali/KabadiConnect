import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, PackagePlus } from 'lucide-react'
import { Button, Card, EmptyState, Modal, PageHeader, StatusBadge, Tabs } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { WASTE, wasteName } from '../../data/mock'
import { fmtDate, inr } from '../../utils'
import { Ico } from '../../utils/icons'

const GROUPS = {
  Upcoming: ['Requested', 'Accepted'],
  Active: ['On the Way', 'Collected', 'Sorted', 'Processing', 'Recycling'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled', 'Rejected'],
}

export default function MyPickups() {
  const { myPickups, cancelPickup, dataLoading, dataError } = useApp()
  const [tab, setTab] = useState('Upcoming')
  const [confirm, setConfirm] = useState(null)
  const tabs = Object.keys(GROUPS).map((k) => ({ id: k, label: k, count: myPickups.filter((p) => GROUPS[k].includes(p.status)).length }))
  const list = myPickups.filter((p) => GROUPS[tab].includes(p.status))
  return (
    <div>
      <PageHeader title="My pickups" subtitle="Track every request from booking to recycled." actions={<Button to="/user/request-pickup"><PackagePlus size={16} />New request</Button>} />
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-6 w-fit max-w-full" />
      {dataLoading && <p className="mb-4 text-sm text-muted">Loading pickups…</p>}
      {dataError && <p role="alert" className="mb-4 text-sm text-bad">{dataError}</p>}
      {list.length === 0 ? (
        <EmptyState icon="Package" title={`No ${tab.toLowerCase()} pickups`} text={tab === 'Upcoming' ? 'Book a pickup and it will show up here.' : 'Pickups in this state will appear here.'} action={<Button to="/user/request-pickup">Request pickup</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => {
            const recycler = p.recycler_business
            const w = WASTE.find((x) => x.id === p.waste)
            return (
              <Card key={p.id} hover>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><Ico name={w?.icon} size={22} /></span><div><p className="font-semibold">{p.qty} kg {wasteName(p.waste)}</p><p className="text-xs text-muted">{p.public_reference}</p></div></div>
                  <StatusBadge status={p.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="flex items-center gap-1.5 text-muted"><MapPin size={14} />Recycler</dt><dd className="text-right">{recycler}</dd>
                  <dt className="flex items-center gap-1.5 text-muted"><Calendar size={14} />Date</dt><dd className="text-right">{fmtDate(p.date)}</dd>
                  <dt className="flex items-center gap-1.5 text-muted"><Clock size={14} />Time</dt><dd className="text-right">{p.time}</dd>
                  <dt className="text-muted">Estimated value</dt><dd className="text-right font-semibold text-accent">{inr(p.value)}</dd>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button to={`/user/pickups/${p.id}`} size="sm">{p.status === 'Requested' || p.status === 'Accepted' ? 'View details' : 'View journey'}</Button>
                  {['Requested', 'Accepted'].includes(p.status) && <Button size="sm" variant="danger" onClick={() => setConfirm(p)}>Cancel</Button>}
                </div>
              </Card>
            )
          })}
        </div>
      )}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Cancel this pickup?">
        <p className="text-sm text-muted">Request {confirm?.public_reference} for {confirm?.qty} kg {confirm && wasteName(confirm.waste)} will be cancelled. You can always book a new one.</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setConfirm(null)}>Keep pickup</Button><Button variant="danger" onClick={() => { cancelPickup(confirm.id); setConfirm(null) }}>Yes, cancel</Button></div>
      </Modal>
    </div>
  )
}
