import { motion } from 'framer-motion'
import { Check, Factory, Home, Package, Recycle, CheckCircle2 } from 'lucide-react'
import { STAGES } from '../data/mock'

export const JOURNEY = [
  { key: 'Collected', at: 3, icon: Home, note: 'Picked up from your doorstep and weighed' },
  { key: 'Sorted', at: 4, icon: Package, note: 'Separated by material type' },
  { key: 'Processing', at: 5, icon: Recycle, note: 'Cleaned, baled and prepared' },
  { key: 'Recycling', at: 6, icon: Factory, note: 'Sent to the recycling facility' },
  { key: 'Recycled', at: 7, icon: CheckCircle2, note: 'Turned into raw material for reuse' },
]

export const stageIndex = (status) => Math.max(STAGES.indexOf(status), 0)
export const journeyPct = (status) => {
  const i = stageIndex(status)
  return i < 3 ? 0 : Math.round(((i - 2) / 5) * 100)
}

// Vertical: full animated journey. Horizontal: compact version for cards.
export default function Journey({ status, orientation = 'vertical' }) {
  const idx = stageIndex(status)
  const cur = JOURNEY.findIndex((s) => idx < s.at)
  if (orientation === 'horizontal') {
    return (
      <ol className="flex items-center" aria-label="Waste journey">
        {JOURNEY.map((s, i) => {
          const done = idx >= s.at
          return (
            <li key={s.key} className="flex flex-1 items-center last:flex-none">
              <span title={s.key} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs ${done ? 'border-accent bg-accent text-bg' : i === cur ? 'border-accent text-accent' : 'border-line text-muted'}`}>
                {done ? <Check size={16} aria-label={`${s.key} done`} /> : <s.icon size={15} aria-hidden="true" />}
              </span>
              {i < JOURNEY.length - 1 && <span className="mx-1 h-0.5 flex-1 overflow-hidden rounded bg-line"><motion.span className="block h-full bg-accent" initial={{ width: 0 }} animate={{ width: idx > s.at ? '100%' : '0%' }} transition={{ duration: 0.6 }} /></span>}
            </li>
          )
        })}
      </ol>
    )
  }
  return (
    <ol className="relative" aria-label="Waste journey">
      {JOURNEY.map((s, i) => {
        const done = idx >= s.at
        const active = i === cur && idx >= 3
        const waiting = idx < 3 && i === 0
        return (
          <motion.li key={s.key} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex gap-5 pb-8 last:pb-0">
            {i < JOURNEY.length - 1 && (
              <span className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-0.5 overflow-hidden rounded bg-line" aria-hidden="true">
                <motion.span className="block w-full bg-gradient-to-b from-accent to-primary" initial={{ height: 0 }} animate={{ height: idx > s.at ? '100%' : '0%' }} transition={{ duration: 0.8, delay: i * 0.15 }} />
              </span>
            )}
            <span className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl border ${done ? 'border-accent bg-gradient-to-br from-accent to-primary text-bg shadow-glow' : active || waiting ? 'border-accent text-accent' : 'border-line bg-card text-muted'}`}>
              <s.icon size={24} aria-hidden="true" />
              {active && <span className="absolute inset-0 animate-ping rounded-2xl border border-accent/60" aria-hidden="true" />}
            </span>
            <div className="pt-1.5">
              <p className="flex items-center gap-2 font-display text-lg font-semibold">{s.key}{done && <Check size={16} className="text-ok" aria-label="Completed step" />}</p>
              <p className="text-sm text-muted">{done ? s.note : active ? 'In progress now' : 'Waiting'}</p>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
