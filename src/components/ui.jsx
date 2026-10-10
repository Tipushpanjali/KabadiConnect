import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, Search, Star, CheckCircle2, AlertTriangle, Info, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { statusTone } from '../utils'
import { Ico } from '../utils/icons'

const VAR = {
  primary: 'bg-gradient-to-r from-accent to-primary text-bg font-semibold shadow-glow hover:brightness-110 hover:-translate-y-0.5',
  outline: 'border border-line text-ink hover:border-accent/60 hover:bg-accent/5',
  ghost: 'text-muted hover:text-ink hover:bg-white/5',
  danger: 'bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20',
  success: 'bg-ok/10 text-ok border border-ok/30 hover:bg-ok/20',
}
const SIZE = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }

export function Button({ variant = 'primary', size = 'md', to, className = '', children, ...p }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl transition duration-200 active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none ${VAR[variant]} ${SIZE[size]} ${className}`
  if (to) return <Link to={to} className={cls} {...p}>{children}</Link>
  return <button type="button" className={cls} {...p}>{children}</button>
}

export function Card({ className = '', hover = false, children, ...p }) {
  return (
    <div className={`card p-5 ${hover ? 'transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow' : ''} ${className}`} {...p}>
      {children}
    </div>
  )
}

const TONE = {
  ok: 'bg-ok/10 text-ok border-ok/25',
  warn: 'bg-warn/10 text-warn border-warn/25',
  bad: 'bg-bad/10 text-bad border-bad/25',
  info: 'bg-accent/10 text-accent border-accent/25',
  mute: 'bg-white/5 text-muted border-line',
}
export function Badge({ tone = 'info', className = '', children }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONE[tone]} ${className}`}>{children}</span>
}
export const StatusBadge = ({ status }) => (
  <Badge tone={statusTone(status)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </Badge>
)

export function Stat({ icon, label, value, sub, to }) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><Ico name={icon} size={18} /></span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold sm:text-3xl">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </>
  )
  const cls = 'card block p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow'
  return to ? <Link to={to} className={cls}>{body}</Link> : <div className={cls}>{body}</div>
}

export function Progress({ value, max = 100, className = '', label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-line ${className}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div role="dialog" aria-modal="true" aria-label={title} className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-line bg-card p-6 shadow-soft ${wide ? 'max-w-2xl' : 'max-w-md'}`} initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 12, opacity: 0 }}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1 text-muted hover:bg-white/5 hover:text-ink"><X size={20} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function EmptyState({ icon = 'Inbox', title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent"><Ico name={icon} size={30} /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export const Skeleton = ({ className = 'h-24' }) => <div className={`skeleton ${className}`} aria-hidden="true" />
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div>
      <div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-64 lg:col-span-2" /><Skeleton className="h-64" /></div>
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function TextField({ label, id, error, hint, className = '', ...p }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className={`input ${error ? '!border-bad focus:!ring-bad/25' : ''}`} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...p} />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-bad">{error}</p>}
    </div>
  )
}
export function SelectField({ label, id, children, className = '', ...p }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      <select id={id} className="input" {...p}>{children}</select>
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input type="search" aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input !pl-10" />
    </div>
  )
}

export function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 overflow-x-auto rounded-xl border border-line bg-bg/60 p-1 ${className}`} role="tablist">
      {tabs.map((t) => {
        const id = t.id ?? t
        const active = value === id
        return (
          <button key={id} role="tab" aria-selected={active} onClick={() => onChange(id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm transition ${active ? 'bg-accent/15 font-semibold text-accent' : 'text-muted hover:text-ink'}`}>
            {t.label ?? t}{t.count != null && <span className="ml-1.5 text-xs opacity-70">{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Dropdown({ trigger, children, align = 'right', label = 'Menu' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const k = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', h)
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k) }
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label={label} className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-white/5">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" onClick={() => setOpen(false)} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className={`absolute z-50 mt-2 w-60 rounded-2xl border border-line bg-card p-2 shadow-soft ${align === 'right' ? 'right-0' : 'left-0'}`}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export function MenuItem({ to, onClick, icon: Icon, children, danger }) {
  const cls = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/5 ${danger ? 'text-bad' : 'text-ink'}`
  const inner = <>{Icon && <Icon size={16} aria-hidden="true" />}{children}</>
  return to ? <Link role="menuitem" to={to} className={cls}>{inner}</Link> : <button role="menuitem" onClick={onClick} className={cls}>{inner}</button>
}

export function Avatar({ name = '?', size = 40, className = '' }) {
  const ini = name.replace(/\(.*\)/, '').trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase()
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-primary font-display font-bold text-bg ${className}`}>
      {ini}
    </span>
  )
}

export function Rating({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${value} out of 5`}>
      <Star size={size} className="fill-warn text-warn" aria-hidden="true" />
      <span className="font-semibold">{Number(value).toFixed(1)}</span>
    </span>
  )
}

const FALLBACK = (label) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0D1F29"/><stop offset="1" stop-color="#0B3A4A"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><g fill="none" stroke="#22D3EE" stroke-opacity=".35" stroke-width="3"><circle cx="400" cy="250" r="90"/><circle cx="400" cy="250" r="140" stroke-opacity=".15"/><path d="M360 200v100M360 250l50-50M360 250l50 50" stroke-width="12" stroke-linecap="round" stroke-opacity=".7"/></g><text x="400" y="440" fill="#7FA3B3" font-family="sans-serif" font-size="22" text-anchor="middle">${label || ''}</text></svg>`)

export function Img({ src, alt, className = '', overlay = true, ...p }) {
  const [bad, setBad] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={bad ? FALLBACK(alt) : src} alt={alt} loading="lazy" onError={() => setBad(true)} className="h-full w-full object-cover" {...p} />
      {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-primary/10" />}
    </div>
  )
}

export function Counter({ to, prefix = '', suffix = '', decimals = 0, duration = 1600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (t) => {
      const k = Math.min((t - start) / duration, 1)
      setV(to * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

// Table on desktop, stacked cards on mobile
export function DataTable({ columns, rows, onRow, empty }) {
  if (!rows.length) return empty || null
  return (
    <>
      <div className="card hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg/40 text-xs text-muted">
            <tr>{columns.map((c) => <th key={c.key} scope="col" className={`px-4 py-3 font-medium ${c.className || ''}`}>{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r, i) => (
              <tr key={r.id ?? i} onClick={onRow ? () => onRow(r) : undefined} className={`transition hover:bg-white/[.03] ${onRow ? 'cursor-pointer' : ''}`}>
                {columns.map((c) => <td key={c.key} className={`px-4 py-3.5 ${c.className || ''}`}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((r, i) => (
          <div key={r.id ?? i} onClick={onRow ? () => onRow(r) : undefined} className="card space-y-2 p-4">
            {columns.map((c) => (
              <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">{c.label}</span>
                <span className="text-right">{c.render ? c.render(r) : r[c.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.q} className="card overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium">
            {it.q}
            <ChevronDown size={18} className={`shrink-0 text-accent transition ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-muted">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export function ToastHost() {
  const { toasts, dismissToast } = useApp()
  const I = { success: CheckCircle2, error: AlertTriangle, info: Info }
  const C = { success: 'text-ok', error: 'text-bad', info: 'text-accent' }
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const Ic = I[t.type] || Info
          return (
            <motion.div key={t.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-soft">
              <Ic size={18} className={`mt-0.5 shrink-0 ${C[t.type]}`} aria-hidden="true" />
              <p className="flex-1 text-sm">{t.msg}</p>
              <button onClick={() => dismissToast(t.id)} aria-label="Dismiss notification" className="text-muted hover:text-ink"><X size={16} /></button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div><p className="text-sm font-medium">{label}</p>{desc && <p className="text-xs text-muted">{desc}</p>}</div>
      <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-accent' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
