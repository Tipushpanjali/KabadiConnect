import { Link } from 'react-router-dom'

export function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22D3EE" /><stop offset="1" stopColor="#0891B2" /></linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#lm)" />
      <path d="M16 12v24M16 24l12-12M16 24l12 12" stroke="#06121A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M34 15a13 13 0 0 1 0 18" stroke="#06121A" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55" />
      <path d="M31.5 12.5 34.5 15l-3.2 2.2" stroke="#06121A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".55" />
    </svg>
  )
}

export default function Logo({ to = '/', compact = false }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="Kabadi Connect home">
      <LogoMark />
      {!compact && (
        <span className="font-display text-lg font-extrabold leading-none tracking-tight">
          KABADI<span className="gradient-text"> CONNECT</span>
        </span>
      )}
    </Link>
  )
}
