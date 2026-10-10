import { Link } from 'react-router-dom'
import { Search, PackagePlus, Truck, Factory, Wallet, ShieldCheck, Home, Recycle, Building2 } from 'lucide-react'
import { Button, Card, Img, Accordion } from '../../components/ui'
import { IMG, FAQS } from '../../data/mock'

const STEPS = [
  [Search, 'Find a recycler', 'Browse verified recyclers by distance, rating, availability and rate per kg.'],
  [PackagePlus, 'Request a pickup', 'Choose the waste, estimate the quantity, pick a slot and confirm your address.'],
  [Truck, 'Recycler accepts and collects', 'The recycler accepts, travels to you, weighs the waste and marks it collected.'],
  [Factory, 'Track the journey', 'Your waste moves through sorting, processing and recycling. You see every stage.'],
  [Wallet, 'Get paid and earn points', 'Completion updates your impact, Green Points and leaderboard position.'],
]
export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">How Kabadi Connect <span className="gradient-text">works</span></h1>
          <p className="mt-4 text-muted">A simple loop that connects households, recyclers and societies and keeps every step visible.</p>
          <div className="mt-6 flex gap-3"><Button to="/register">Get Started</Button><Button to="/find-recycler" variant="outline">Find a Recycler</Button></div>
        </div>
        <Img src={IMG.sorting} alt="Recyclables sorted into bins" className="aspect-video rounded-3xl border border-line" />
      </div>
      <ol className="mt-14 space-y-4">
        {STEPS.map(([Ic, t, d], i) => (
          <li key={t} className="card flex items-start gap-5 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary text-bg"><Ic aria-hidden="true" /></span>
            <div><h2 className="text-lg font-semibold"><span className="text-accent">{i + 1}.</span> {t}</h2><p className="mt-1 text-sm text-muted">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[[Home, 'For households', '/register'], [Recycle, 'For recyclers', '/register?role=recycler'], [Building2, 'For societies', '/register?role=society']].map(([Ic, t, to]) => (
          <Card key={t} hover><Ic className="text-accent" aria-hidden="true" /><h3 className="mt-3 font-semibold">{t}</h3><Link to={to} className="mt-2 inline-block text-sm text-accent hover:underline">Sign up</Link></Card>
        ))}
      </div>
      <h2 className="mb-5 mt-16 text-2xl font-bold">Common questions</h2>
      <Accordion items={FAQS.slice(0, 5)} />
    </div>
  )
}
