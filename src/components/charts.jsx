import { useId, useState } from 'react'
import { motion } from 'framer-motion'

const W = 600
const P = { l: 44, r: 14, t: 18, b: 28 }

function grid(max, H, fmt) {
  return [0, 0.25, 0.5, 0.75, 1].map((k) => {
    const y = P.t + (1 - k) * (H - P.t - P.b)
    return (
      <g key={k}>
        <line x1={P.l} x2={W - P.r} y1={y} y2={y} stroke="#173341" strokeDasharray="3 4" />
        <text x={P.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#7FA3B3">{fmt(Math.round(max * k))}</text>
      </g>
    )
  })
}

export function AreaChart({ data, labels, color = '#22D3EE', height = 240, fmt = (v) => v, unit = '' }) {
  const [hi, setHi] = useState(null)
  const gid = useId().replace(/:/g, '')
  const H = height
  const max = (Math.max(...data, 1)) * 1.15
  const step = (W - P.l - P.r) / Math.max(data.length - 1, 1)
  const x = (i) => P.l + i * step
  const y = (v) => P.t + (1 - v / max) * (H - P.t - P.b)
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Area chart: ${labels.map((l, i) => `${l} ${data[i]}`).join(', ')}`} onMouseLeave={() => setHi(null)}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".4" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid(max, H, fmt)}
      <motion.path d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      {labels.map((l, i) => <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#7FA3B3">{l}</text>)}
      {data.map((v, i) => (
        <g key={i}>
          <rect x={x(i) - step / 2} y={P.t} width={step} height={H - P.t - P.b} fill="transparent" onMouseEnter={() => setHi(i)} onTouchStart={() => setHi(i)} />
          <circle cx={x(i)} cy={y(v)} r={hi === i ? 6 : 3.5} fill="#06121A" stroke={color} strokeWidth="2.5" />
        </g>
      ))}
      {hi != null && (
        <g pointerEvents="none">
          <line x1={x(hi)} x2={x(hi)} y1={P.t} y2={H - P.b} stroke={color} strokeOpacity=".4" />
          <rect x={Math.min(Math.max(x(hi) - 48, 4), W - 100)} y={Math.max(y(data[hi]) - 40, 2)} width="96" height="28" rx="8" fill="#0D1F29" stroke={color} strokeOpacity=".6" />
          <text x={Math.min(Math.max(x(hi) - 48, 4), W - 100) + 48} y={Math.max(y(data[hi]) - 40, 2) + 18} textAnchor="middle" fontSize="12" fontWeight="600" fill="#ECFEFF">{fmt(data[hi])}{unit}</text>
        </g>
      )}
    </svg>
  )
}

export function BarChart({ data, labels, color = '#06B6D4', height = 240, fmt = (v) => v, unit = '' }) {
  const [hi, setHi] = useState(null)
  const H = height
  const max = (Math.max(...data, 1)) * 1.15
  const slot = (W - P.l - P.r) / data.length
  const bw = Math.min(slot * 0.55, 46)
  const base = H - P.b
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Bar chart: ${labels.map((l, i) => `${l} ${data[i]}`).join(', ')}`} onMouseLeave={() => setHi(null)}>
      {grid(max, H, fmt)}
      {data.map((v, i) => {
        const h = (v / max) * (H - P.t - P.b)
        const cx = P.l + slot * i + slot / 2
        return (
          <g key={i} onMouseEnter={() => setHi(i)} onTouchStart={() => setHi(i)}>
            <rect x={cx - slot / 2} y={P.t} width={slot} height={H - P.t - P.b} fill="transparent" />
            <motion.rect x={cx - bw / 2} width={bw} rx="6" fill={hi === i ? '#22D3EE' : color} initial={{ height: 0, y: base }} animate={{ height: h, y: base - h }} transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }} />
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="#7FA3B3">{labels[i]}</text>
            {hi === i && <text x={cx} y={base - h - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="#ECFEFF">{fmt(v)}{unit}</text>}
          </g>
        )
      })}
    </svg>
  )
}

export function Donut({ data, center, sub }) {
  const [hi, setHi] = useState(null)
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const R = 62
  const C = 2 * Math.PI * R
  let off = 0
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 160 160" className="h-44 w-44 shrink-0" role="img" aria-label={`Donut chart: ${data.map((d) => `${d.name} ${d.value}`).join(', ')}`}>
        <g transform="rotate(-90 80 80)">
          {data.map((d, i) => {
            const len = (d.value / total) * C
            const el = (
              <motion.circle key={d.name} cx="80" cy="80" r={R} fill="none" stroke={d.color} strokeWidth={hi === i ? 22 : 18}
                strokeDasharray={`${Math.max(len - 2, 0)} ${C - Math.max(len - 2, 0)}`} strokeDashoffset={-off}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} />
            )
            off += len
            return el
          })}
        </g>
        <text x="80" y="78" textAnchor="middle" fontSize="20" fontWeight="700" fill="#ECFEFF" fontFamily="Sora, sans-serif">{hi != null ? data[hi].value : center}</text>
        <text x="80" y="96" textAnchor="middle" fontSize="10" fill="#7FA3B3">{hi != null ? data[hi].name : sub}</text>
      </svg>
      <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2" onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="ml-auto font-medium">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
