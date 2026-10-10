import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { Badge, Button, Card, EmptyState, PageHeader, Rating, SearchInput, SelectField, Skeleton } from '../../components/ui'
import { WASTE, wasteName } from '../../data/mock'
import { listAvailableRecyclers } from '../../services/appData'

export default function FindRecycler() {
  const { pathname } = useLocation()
  const base = pathname.startsWith('/user') ? '/user' : ''
  const [sp] = useSearchParams()
  const [recyclers, setRecyclers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [waste, setWaste] = useState(WASTE.some((w) => w.id === sp.get('waste')) ? sp.get('waste') : 'all')
  const [rating, setRating] = useState('all')
  const [sel, setSel] = useState(null)

  const load = () => { setLoading(true); setError(''); listAvailableRecyclers().then(setRecyclers).catch((e) => setError(e.message || 'Could not load recyclers.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const list = useMemo(() => recyclers.filter((r) =>
    (!q || `${r.name} ${r.business} ${r.area}`.toLowerCase().includes(q.toLowerCase())) &&
    (waste === 'all' || r.accepts.includes(waste)) &&
    (rating === 'all' || r.rating >= Number(rating))), [q, waste, rating, recyclers])
  const reset = () => { setQ(''); setWaste('all'); setRating('all') }
  const pickupLink = (id) => (base ? `/user/request-pickup?recycler=${id}${waste !== 'all' ? `&waste=${waste}` : ''}` : `/login`)

  return (
    <div className={base ? '' : 'mx-auto max-w-7xl px-4 py-10 sm:px-6'}>
      <PageHeader title="Find a recycler" subtitle="Compare verified recyclers by accepted materials, rates and customer ratings." />
      <Card className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium"><SlidersHorizontal size={16} className="text-accent" aria-hidden="true" />Filters</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1"><label className="label" htmlFor="rs">Search</label><SearchInput value={q} onChange={setQ} placeholder="Name or area" /></div>
          <SelectField id="fw" label="Waste type" value={waste} onChange={(e) => setWaste(e.target.value)}><option value="all">All types</option>{WASTE.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</SelectField>
          <SelectField id="fr" label="Rating" value={rating} onChange={(e) => setRating(e.target.value)}><option value="all">Any rating</option><option value="4">4.0 and above</option><option value="4.5">4.5 and above</option></SelectField>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="order-2 space-y-4 xl:order-1">
          <p className="text-sm text-muted" aria-live="polite">{loading ? 'Loading verified recyclers…' : `${list.length} recycler${list.length === 1 ? '' : 's'} found`}</p>
          {error ? <Card role="alert"><p className="text-sm text-danger">{error}</p><Button className="mt-3" onClick={load} variant="outline">Retry</Button></Card> : loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />) : list.length === 0 ? (
            <EmptyState icon="Recycle" title="No recyclers found" text="Try widening the distance, lowering the rating or clearing your filters." action={<Button onClick={reset} variant="outline">Clear filters</Button>} />
          ) : list.map((r) => (
            <Card key={r.id} hover onMouseEnter={() => setSel(r.id)} className={sel === r.id ? '!border-accent/60' : ''}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{r.business}</h2>
                    {r.verified && <Badge tone="ok"><BadgeCheck size={12} />Verified</Badge>}
                  </div>
                  <p className="text-sm text-muted">{r.area}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {r.reviews ? <><Rating value={r.rating} /><span className="text-muted">({r.reviews})</span></> : <span className="text-muted">No reviews yet</span>}
                  </div>
                </div>
              <Badge tone="ok">Accepting requests</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.accepts.map((a) => <span key={a} className={`rounded-lg border px-2.5 py-1 text-xs ${a === waste ? 'border-accent/50 bg-accent/10 text-accent' : 'border-line text-muted'}`}>{wasteName(a)} {'\u20B9'}{r.rates[a]}/kg</span>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button to={pickupLink(r.id)} size="sm">Request pickup</Button>
                <Button to={`${base}/recyclers/${r.id}`} size="sm" variant="outline">View details</Button>
              </div>
            </Card>
          ))}
        </div>

        <aside className="order-1 xl:order-2" aria-label="Recycler service areas">
          <div className="card sticky top-24 overflow-hidden">
            <div className="grid min-h-64 place-items-center bg-[#08202b] p-6 text-center"><div><SlidersHorizontal className="mx-auto mb-3 text-accent" size={28} /><p className="font-semibold">Service areas</p><p className="mt-2 text-sm text-muted">{list.length} verified recycler{list.length === 1 ? '' : 's'} accepting requests.</p><p className="mt-2 text-xs text-muted">Map locations are unavailable because public coordinates are not configured.</p></div></div>
            <div className="border-t border-line p-4 text-sm">
              {sel && list.find((r) => r.id === sel) ? (() => { const r = list.find((x) => x.id === sel); return <div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{r.business}</p><p className="text-muted">{r.area}</p></div><Button to={`${base}/recyclers/${r.id}`} size="sm" variant="outline">Details</Button></div> })() : <p className="text-muted">Service areas are provided by recycler profiles.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
