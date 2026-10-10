import { useState } from 'react'
import { Card, PageHeader, Stat, Tabs } from '../../components/ui'
import { AreaChart, BarChart } from '../../components/charts'
import { useApp } from '../../context/AppContext'
import { MONTHS, WEEK_DAYS } from '../../data/mock'
import { inr } from '../../utils'

export default function Earnings() {
  const { earningsExtra, transactions } = useApp()
  const [tab, setTab] = useState('Weekly')
  const now = new Date()
  const week = WEEK_DAYS.map((_, i) => { const d = new Date(now); d.setDate(now.getDate() - (6 - i)); const key = d.toDateString(); return transactions.filter((t) => new Date(`${t.date}T00:00:00`).toDateString() === key).reduce((s, t) => s + t.value, 0) })
  const month = MONTHS.map((_, i) => { const monthNum = now.getMonth() - (5 - i); const date = new Date(now.getFullYear(), monthNum, 1); return transactions.filter((t) => { const d = new Date(`${t.date}T00:00:00`); return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear() }).reduce((s, t) => s + t.value, 0) })
  const today = transactions.filter((t) => t.date === now.toISOString().slice(0, 10)).reduce((s, t) => s + t.value, 0)
  const weekTotal = week.reduce((s, v) => s + v, 0)
  const monthTotal = month.at(-1) || 0
  return (
    <div>
      <PageHeader title="Earnings" subtitle="Recorded recycler settlements. No payment gateway is connected." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="Wallet" label="Today" value={inr(today)} />
        <Stat icon="Wallet" label="This week" value={inr(weekTotal)} />
        <Stat icon="Wallet" label="This month" value={inr(monthTotal)} />
        <Stat icon="Wallet" label="All time" value={inr(earningsExtra)} />
      </div>
      <Card className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{tab} earnings</h2><Tabs tabs={['Weekly', 'Monthly']} value={tab} onChange={setTab} /></div>
        {tab === 'Weekly' ? <BarChart data={week} labels={WEEK_DAYS} fmt={(v) => `\u20B9${v.toLocaleString('en-IN')}`} /> : <AreaChart data={month} labels={MONTHS} fmt={(v) => `\u20B9${(v / 1000).toFixed(0)}k`} />}
      </Card>
    </div>
  )
}
