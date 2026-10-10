import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Factory, Home, Package, Recycle, Search, Sparkles, Trophy, Truck, Wallet, Clock, EyeOff, Shuffle } from 'lucide-react'
import { Badge, Button, Card, Img } from '../../components/ui'
import { Ico } from '../../utils/icons'
import { IMG, WASTE } from '../../data/mock'

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.55 } }

function Section({ title, sub, children, className = '' }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 ${className}`}>
      <motion.div {...fade} className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
        {sub && <p className="mt-3 text-muted">{sub}</p>}
      </motion.div>
      {children}
    </section>
  )
}

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 })
  }
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div>
          <Badge className="mb-5"><Sparkles size={12} />Digital kabadi marketplace</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Turn Waste <span className="gradient-text">Into Value.</span>
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Kabadi Connect digitally connects households with verified recyclers, so you can book a pickup, see fair rates upfront and follow your waste all the way to recycling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/register" size="lg">Get Started <ArrowRight size={18} /></Button>
            <Button to="/find-recycler" size="lg" variant="outline"><Search size={18} />Find a Recycler</Button>
          </div>
          <p className="mt-10 text-sm text-muted">Join the network and help make local recycling easier to track.</p>
        </div>
        <div className="relative" style={{ perspective: 1100 }} onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="transition-transform duration-200 ease-out" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}>
            <Img src={IMG.hero} alt="Plastic bottles sorted for recycling" className="aspect-[4/3] rounded-3xl border border-line shadow-glow" />
          </div>
        </div>
      </div>
    </section>
  )
}

const PROBLEMS = [[EyeOff, 'No transparency', 'Households rarely know where their waste goes or whether the weight and price were fair.'], [Clock, 'Unreliable pickups', 'Waiting for a kabadiwala to pass by wastes hours and often ends in no sale.'], [Shuffle, 'Value gets lost', 'Recyclables are mixed into general waste and end up in landfill instead of being reused.']]
const STEPS = [[Search, 'Find a recycler', 'Compare verified recyclers by rate, rating and service area.'], [Package, 'Request pickup', 'Pick material, quantity, date and time.'], [Truck, 'Doorstep collection', 'Coordinate pickup with your selected recycler.'], [Factory, 'Track the journey', 'Follow your waste through recorded status updates.'], [Wallet, 'Get rewarded', 'Earn Green Points after eligible completed pickups.']]

export default function Landing() {
  return (
    <>
      <Hero />

      <Section title="The kabadi system works, but it is stuck in the past" sub="Millions of households want to recycle. The missing piece is a trusted, visible link between them and the people who collect.">
        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEMS.map(([Ic, t, d]) => (
            <motion.div key={t} {...fade}><Card hover className="h-full"><Ic className="text-accent" size={26} aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></Card></motion.div>
          ))}
        </div>
      </Section>

      <Section title="One platform for everyone in the recycling chain">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div {...fade}><Img src={IMG.community} alt="Neighbours sorting recyclables together" className="aspect-[16/11] rounded-3xl border border-line" /></motion.div>
          <motion.ul {...fade} className="space-y-4">
            {[[Home, 'Households', 'Book pickups, track every kilo and earn Green Points.'], [Recycle, 'Recyclers', 'Receive organised requests, build reputation and grow earnings.'], [Trophy, 'Societies', 'Run challenges, see participation and hit monthly targets.']].map(([Ic, t, d]) => (
              <li key={t} className="card flex gap-4 p-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><Ic aria-hidden="true" /></span><div><h3 className="font-semibold">{t}</h3><p className="text-sm text-muted">{d}</p></div></li>
            ))}
          </motion.ul>
        </div>
      </Section>

      <Section title="How it works" sub="From your doorstep to a recycling plant in five clear steps.">
        <ol className="grid gap-4 md:grid-cols-5">
          {STEPS.map(([Ic, t, d], i) => (
            <motion.li key={t} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="card relative p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary text-bg"><Ic size={20} aria-hidden="true" /></span>
              <h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p>
              <span className="absolute right-4 top-4 font-display text-sm text-line">{i + 1}</span>
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section title="Waste we help you recycle" sub="Explore accepted materials, then check the live rates offered by verified recyclers in your service area.">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {WASTE.map((w) => (
            <Link key={w.id} to={`/find-recycler?waste=${w.id}`} className="group relative overflow-hidden rounded-2xl border border-line">
              <Img src={w.img} alt={`${w.name} for recycling`} className="aspect-[4/3] transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div><span className="mb-1 grid h-9 w-9 place-items-center rounded-lg bg-bg/70 text-accent backdrop-blur"><Ico name={w.icon} size={18} /></span><h3 className="font-display font-semibold">{w.name}</h3><p className="hidden text-xs text-muted sm:block">{w.tip}</p></div>
                <span className="rounded-full bg-bg/80 px-3 py-1 text-xs font-semibold text-accent backdrop-blur">Check local rates</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Find a recycler" sub="Browse verified businesses that have completed their profile and enabled pickup requests.">
        <Card className="flex flex-wrap items-center justify-between gap-4"><p className="max-w-xl text-sm text-muted">Recycler listings and rates come from live profiles. Availability depends on verified recyclers in your area.</p><Button to="/find-recycler">Browse verified recyclers <ArrowRight size={16} /></Button></Card>
      </Section>

      <section className="relative overflow-hidden border-y border-line bg-card/40">
        <Img src={IMG.facility} alt="" overlay={false} className="absolute inset-0 opacity-15" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">Impact you can see</h2>
          <p className="mt-2 text-sm text-muted">Completed pickup quantities power account impact estimates. Public platform totals will appear as verified production data accumulates.</p>
        </div>
      </section>

      <Section title="Green Points: recycling that rewards you" sub="Every completed pickup earns points you can redeem for real perks.">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {[['Coffee', 'Partner coupons', 'From 400 pts'], ['Train', 'Transit recharge', 'From 600 pts'], ['TreePine', 'Plant a tree', 'From 300 pts'], ['Medal', 'Recycling badges', 'From 200 pts']].map(([ic, t, d]) => (
              <Card key={t} hover><span className="text-accent"><Ico name={ic} size={24} /></span><h3 className="mt-3 font-semibold">{t}</h3><p className="text-sm text-muted">{d}</p></Card>
            ))}
          </div>
          <Card className="bg-gradient-to-br from-card to-[#0B3040] p-8">
            <p className="text-sm text-muted">Earn points with completed pickups</p>
            <p className="mt-3 text-sm text-muted">Your balance and reward catalogue are available after you sign in.</p>
            <Button to="/register" className="mt-6">Start earning</Button>
          </Card>
        </div>
      </Section>

      <Section title="Society challenge" sub="Neighbourhoods compete to recycle the most. Rankings update as pickups complete.">
        <Card className="p-6 sm:p-8">
          <ul className="space-y-5">
            <li className="text-sm text-muted">Society rankings will be listed once enrolled societies have verified members and completed pickups.</li>
          </ul>
          <Button to="/leaderboard" variant="outline" className="mt-6">View full leaderboard</Button>
        </Card>
      </Section>

      <Section title="Follow your waste journey" sub="Know exactly where your 8.5 kg of cardboard is, at every stage.">
        <Card className="p-6 sm:p-8">
          <ol className="grid gap-6 sm:grid-cols-5">
            {[[Home, 'Collected'], [Package, 'Sorted'], [Recycle, 'Processing'], [Factory, 'Recycling'], [Check, 'Recycled']].map(([Ic, l], i) => (
              <motion.li key={l} {...fade} transition={{ delay: i * 0.12, duration: 0.5 }} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary text-bg shadow-glow"><Ic aria-hidden="true" /></span>
                <div><p className="font-semibold">{l}</p><p className="text-xs text-ok">Done</p></div>
                {i < 4 && <span className="absolute left-14 top-1/2 hidden h-0.5 w-[calc(100%-3.5rem)] -translate-y-1/2 bg-gradient-to-r from-accent to-primary/30 sm:block" aria-hidden="true" />}
              </motion.li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section title="Built for the whole recycling chain" sub="Households, recyclers and society managers can create accounts and use role-specific workflows." />

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-[#0B3040] to-card px-6 py-14 text-center sm:px-12">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-5xl">Ready to turn waste into value?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Join households, recyclers and societies making recycling simple, visible and rewarding.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Button to="/register" size="lg">Create free account</Button><Button to="/login" size="lg" variant="outline">Login</Button></div>
          </div>
        </div>
      </section>
    </>
  )
}
