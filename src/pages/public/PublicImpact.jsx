import { Leaf, Recycle, TreePine, Droplets } from 'lucide-react'
import { Card, Img, Badge } from '../../components/ui'
import { IMG } from '../../data/mock'

export default function PublicImpact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-line">
        <Img src={IMG.facility} alt="Recycling facility" className="absolute inset-0 h-full w-full" />
        <div className="relative px-6 py-16 sm:px-12">
          <Badge>Platform impact</Badge>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">Every kilo diverted from landfill <span className="gradient-text">counts</span></h1>
          <p className="mt-3 max-w-xl text-sm text-muted">Household impact is calculated from completed pickup records. Public platform totals are not published until aggregate reporting is configured.</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[[Recycle, 'Completed pickups', 'Available in each signed-in account'], [Leaf, 'Recycling totals', 'Calculated from measured completed quantities'], [TreePine, 'Environmental impact', 'Illustrative estimates, not certified reporting']].map(([Ic, l, description]) => (
          <Card key={l}><Ic className="text-accent" aria-hidden="true" /><h2 className="mt-3 font-semibold">{l}</h2><p className="mt-1 text-sm text-muted">{description}</p></Card>
        ))}
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted"><Droplets size={14} />Water and tree factors are illustrative estimates and are not audited measurements.</p>
    </div>
  )
}
