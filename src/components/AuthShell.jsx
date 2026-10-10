import { Img } from './ui'
import { IMG } from '../data/mock'
import { Recycle, ShieldCheck, Trophy } from 'lucide-react'

export default function AuthShell({ title, subtitle, children, wide = false }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-3xl border border-line lg:block">
        <Img src={IMG.sorting} alt="Sorted recyclable materials in bins" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-bg/70 via-bg/40 to-primary/30" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <h2 className="font-display text-4xl font-extrabold leading-tight">Turn Waste <span className="gradient-text">Into Value.</span></h2>
          <ul className="mt-6 space-y-3 text-sm text-ink/90">
            {[[Recycle, 'Book a doorstep pickup in under a minute'], [ShieldCheck, 'Every recycler is rated and badge-verified'], [Trophy, 'Earn Green Points and climb your society leaderboard']].map(([Ic, t]) => (
              <li key={t} className="glass flex items-center gap-3 rounded-xl px-4 py-3"><Ic size={18} className="text-accent" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`card mx-auto w-full p-6 sm:p-8 ${wide ? 'max-w-xl' : 'max-w-md'}`}>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
