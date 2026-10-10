import { Card, PageHeader, Progress, Stat } from '../../components/ui'
import { AreaChart, BarChart, Donut } from '../../components/charts'
import { MONTHS, PARTICIPATION, SOCIETY_CATEGORY, SOCIETY_MONTHLY } from '../../data/mock'

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Society analytics" subtitle="Trends across the last six months." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Recycle" label="This month" value="3,120 kg" sub="+3.7% vs September" />
        <Stat icon="Package" label="Participation" value="84%" sub="of enrolled homes" />
        <Stat icon="Leaf" label="Best category" value="Paper" sub="34% of total" />
        <Stat icon="Trophy" label="Target" value="78%" sub="of 4,000 kg monthly goal" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">Waste trend (kg)</h2><AreaChart data={SOCIETY_MONTHLY} labels={MONTHS} unit=" kg" /></Card>
        <Card><h2 className="mb-3 font-semibold">Household participation (%)</h2><BarChart data={PARTICIPATION} labels={MONTHS} unit="%" /></Card>
        <Card><h2 className="mb-3 font-semibold">Category breakdown</h2><Donut data={SOCIETY_CATEGORY} center="6" sub="categories" /></Card>
        <Card><h2 className="mb-4 font-semibold">Monthly progress to target</h2><ul className="space-y-4">{MONTHS.map((m, i) => <li key={m}><div className="mb-1 flex justify-between text-sm"><span>{m}</span><span className="text-muted">{SOCIETY_MONTHLY[i]} / 4000 kg</span></div><Progress value={SOCIETY_MONTHLY[i]} max={4000} label={`${m} progress`} /></li>)}</ul></Card>
      </div>
    </div>
  )
}
