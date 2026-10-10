import { Button, Card, Img } from '../../components/ui'
import { IMG } from '../../data/mock'
import { Eye, Handshake, Recycle } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-5xl">About <span className="gradient-text">Kabadi Connect</span></h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">We are building a digital bridge between the households that generate recyclable waste and the kabadiwalas and recyclers who give it a second life.</p>
      <Img src={IMG.people} alt="People working together on a community recycling drive" className="mt-8 aspect-[21/9] rounded-3xl border border-line" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[[Eye, 'Transparency', 'Fair rates, honest weights and a visible journey for every kilo.'], [Handshake, 'Dignity for recyclers', 'Verified profiles, steady demand and recognised work.'], [Recycle, 'Less to landfill', 'Making it easy to separate and sell is the first step.']].map(([Ic, t, d]) => (
          <Card key={t}><Ic className="text-accent" aria-hidden="true" /><h2 className="mt-3 font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></Card>
        ))}
      </div>
      <Card className="mt-8"><h2 className="text-lg font-semibold">Platform status</h2><p className="mt-2 text-sm text-muted">Kabadi Connect uses Supabase for account and application data. Some society analytics and public impact summaries depend on further aggregate reporting configuration.</p></Card>
      <div className="mt-8"><Button to="/contact" variant="outline">Contact the team</Button></div>
    </div>
  )
}
