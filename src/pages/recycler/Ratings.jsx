import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Card, EmptyState, PageHeader, Progress, Rating, Tabs } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function Ratings() {
  const [f, setF] = useState('All')
  const { reviews, recyclerProfile, dataLoading } = useApp()
  const split = Object.fromEntries([1, 2, 3, 4, 5].map((star) => [star, reviews.filter((r) => r.rating === star).length]))
  const total = reviews.length
  const list = reviews.filter((r) => f === 'All' || r.rating === Number(f))
  return (
    <div>
      <PageHeader title="Ratings & reviews" subtitle="What households say about your service." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="text-center"><p className="font-display text-6xl font-extrabold gradient-text">{Number(recyclerProfile?.average_rating || 0).toFixed(1)}</p><div className="mt-2 flex justify-center"><Rating value={Number(recyclerProfile?.average_rating || 0)} size={18} /></div><p className="mt-1 text-sm text-muted">{total} ratings</p></Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">Rating breakdown</h2>
          <ul className="space-y-2.5">{[5, 4, 3, 2, 1].map((s) => <li key={s} className="flex items-center gap-3 text-sm"><span className="w-10">{s} star</span><Progress value={split[s]} max={total} className="flex-1" label={`${s} star ratings`} /><span className="w-10 text-right text-muted">{split[s]}</span></li>)}</ul>
        </Card>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Recent feedback</h2><Tabs tabs={['All', '5', '4']} value={f} onChange={setF} /></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {!dataLoading && list.length ? list.map((r) => <Card key={r.id}><div className="flex items-center justify-between"><p className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString()}</p><Rating value={r.rating} size={13} /></div><p className="mt-3 text-sm text-muted">{r.comment || 'No written comment.'}</p></Card>) : <div className="md:col-span-2"><EmptyState icon="Inbox" title={dataLoading ? 'Loading reviews' : 'No reviews yet'} text={dataLoading ? 'Loading verified customer reviews.' : 'Eligible customers can review after completed pickups.'} /></div>}
      </div>
    </div>
  )
}
