import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Rating, Avatar } from '../../components/ui'
import { WASTE } from '../../data/mock'
import { getRecyclerDetails } from '../../services/appData'

export default function RecyclerDetail() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const base = pathname.startsWith('/user') ? '/user' : ''
  const [r, setRecycler] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let live = true; setLoading(true); getRecyclerDetails(id).then((value) => { if (live) setRecycler(value) }).catch((e) => { if (live) setError(e.message || 'Could not load recycler details.') }).finally(() => { if (live) setLoading(false) }); return () => { live = false } }, [id])
  if (loading) return <div className="mx-auto max-w-3xl p-8" role="status">Loading recycler details…</div>
  if (error) return <div className="mx-auto max-w-3xl p-8"><EmptyState icon="Recycle" title="Could not load recycler" text={error} action={<Button to={`${base}/find-recycler`}>Back to recyclers</Button>} /></div>
  if (!r) return <div className="mx-auto max-w-3xl p-8"><EmptyState icon="Recycle" title="Recycler not found" text="This recycler may have been removed." action={<Button to={`${base}/find-recycler`}>Back to recyclers</Button>} /></div>
  return (
    <div className={base ? '' : 'mx-auto max-w-5xl px-4 py-10 sm:px-6'}>
      <Link to={`${base}/find-recycler`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-accent"><ArrowLeft size={14} />All recyclers</Link>
      <Card className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={r.business_name} size={72} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold">{r.business_name}</h1><Badge tone="ok"><BadgeCheck size={12} />Verified</Badge></div>
          <p className="mt-2 max-w-xl text-sm">{r.business_details || 'Recycler details have not been added yet.'}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">{r.review_count ? <Rating value={Number(r.average_rating)} /> : <span className="text-muted">No reviews yet</span>}<span className="text-muted">{(r.service_areas || []).join(', ') || 'Service area not listed'}</span></div>
        </div>
        <Button to={base ? `/user/request-pickup?recycler=${r.id}` : '/login'}>Request pickup</Button>
      </Card>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["Customer rating", r.review_count ? `${Number(r.average_rating).toFixed(1)} / 5` : 'No reviews'], ['Reviews', r.review_count], ['Availability', r.available ? 'Accepting requests' : 'Unavailable']].map(([l, v]) => <Card key={l}><p className="text-sm text-muted">{l}</p><p className="mt-1 font-display text-2xl font-bold">{v}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Accepted waste and rates</h2>
          <ul className="divide-y divide-line">
            {WASTE.filter((w) => r.accepts.includes(w.id)).map((w) => <li key={w.id} className="flex items-center justify-between py-3 text-sm"><span>{w.name}</span><span className="font-semibold text-accent">{'\u20B9'}{r.rates[w.id]}/kg</span></li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Recent reviews</h2>
          <ul className="space-y-4">{r.reviews.length ? r.reviews.map((v) => <li key={v.id}><div className="flex items-center justify-between text-sm"><span className="font-medium">Verified customer</span><Rating value={v.rating} size={12} /></div><p className="mt-1 text-sm text-muted">{v.comment || 'No written comment.'}</p></li>) : <li className="text-sm text-muted">No completed pickup reviews have been submitted.</li>}</ul>
        </Card>
      </div>
    </div>
  )
}
