import { Droplets, Leaf, Mountain, Recycle, TreePine, Info } from 'lucide-react'
import { AreaChart, BarChart, Donut } from '../../components/charts'
import { Badge, Card, DashboardSkeleton, EmptyState, PageHeader, Progress, Button } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { MONTHS, WASTE } from '../../data/mock'
import { kg, kgByMonth, num } from '../../utils'
import useLoading from '../../hooks/useLoading'

const COLORS = ['#22D3EE', '#06B6D4', '#38BDF8', '#818CF8', '#67E8F9', '#A5B4FC']

export default function Impact() {
  const { impact, myPickups } = useApp()
  const loading = useLoading()
  if (loading) return <DashboardSkeleton />
  if (!impact.count) return <EmptyState icon="Leaf" title="No impact yet" text="Complete your first pickup to see your estimated impact." action={<Button to="/user/request-pickup">Request pickup</Button>} />
  const monthly = kgByMonth(myPickups)
  const donut = WASTE.map((w, i) => ({ name: w.name, value: Math.round((impact.byWaste[w.id] || 0) * 10) / 10, color: COLORS[i] })).filter((d) => d.value > 0)
  const target = 30
  return (
    <div>
      <PageHeader title="Environmental impact" subtitle="Your recycling at a glance." actions={<Badge tone="warn"><Info size={12} />Figures marked est. are estimates</Badge>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[[Recycle, 'Total waste recycled', kg(impact.kg), 'Measured at pickup'], [Mountain, 'Diverted from landfill', kg(impact.kg), 'Same as recycled weight'], [Leaf, 'CO2 avoided (est.)', `${num(Math.round(impact.co2))} kg`, 'Estimate using average factors'], [TreePine, 'Trees spared (est.)', impact.trees.toFixed(1), 'Paper and cardboard only, est.']].map(([Ic, l, v, s]) => (
          <Card key={l}><Ic className="text-accent" aria-hidden="true" /><p className="mt-3 font-display text-2xl font-bold sm:text-3xl">{v}</p><p className="text-sm">{l}</p><p className="mt-1 text-xs text-muted">{s}</p></Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3"><h2 className="mb-1 font-semibold">Recycling activity (kg per month)</h2><p className="mb-3 text-xs text-muted">Completed pickups only</p><AreaChart data={monthly} labels={MONTHS} unit=" kg" /></Card>
        <Card className="lg:col-span-2"><h2 className="mb-3 font-semibold">What you recycled</h2><Donut data={donut} center={`${Math.round(impact.kg)}`} sub="kg total" /></Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Monthly progress</h2>
          <p className="text-sm text-muted">October goal: {target} kg</p>
          <p className="mt-2 font-display text-3xl font-bold">{kg(monthly[5])}</p>
          <Progress value={monthly[5]} max={target} className="mt-3" label="October goal progress" />
          <p className="mt-2 text-xs text-muted">{monthly[5] >= target ? 'Goal reached. Great work!' : `${kg(target - monthly[5])} to go`}</p>
        </Card>
        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Droplets size={18} className="text-accent" />Water saved (est.)</h2>
          <p className="font-display text-3xl font-bold">{num(Math.round(impact.water))} litres</p>
          <p className="mt-2 text-sm text-muted">Estimated from average water used to make new materials versus recycled ones. Real savings vary by process and region.</p>
          <div className="mt-4"><BarChart data={monthly} labels={MONTHS} unit=" kg" height={170} /></div>
        </Card>
      </div>
    </div>
  )
}
