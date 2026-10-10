import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react'
import Logo from './Logo'

const COLS = [
  { title: 'Product', links: [['Find Recycler', '/find-recycler'], ['Request Pickup', '/user/request-pickup'], ['Impact', '/impact'], ['Leaderboard', '/leaderboard']] },
  { title: 'For Recyclers', links: [['Become a Recycler', '/register?role=recycler'], ['Recycler Dashboard', '/recycler/dashboard'], ['Verification', '/recycler/verification']] },
  { title: 'For Societies', links: [['Society Dashboard', '/society/dashboard'], ['Society Challenge', '/society/challenge']] },
  { title: 'Company', links: [['About', '/about'], ['How It Works', '/how-it-works'], ['Contact', '/contact'], ['Help & Support', '/help']] },
  { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']] },
]
const SOCIAL = [[Instagram, 'Instagram'], [Linkedin, 'LinkedIn'], [Twitter, 'X / Twitter'], [Facebook, 'Facebook']]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 font-display text-lg font-semibold gradient-text">Turn Waste Into Value.</p>
            <p className="mt-2 max-w-xs text-sm text-muted">A transparent, digital way to connect households, recyclers and housing societies.</p>
            <div className="mt-5 flex gap-2" aria-label="Social links">
              {SOCIAL.map(([Ic, name]) => (
                <a key={name} href="#top" onClick={(e) => e.preventDefault()} aria-label={name} className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition hover:border-accent/60 hover:text-accent">
                  <Ic size={18} />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h3 className="mb-3 text-sm font-semibold">{c.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {c.links.map(([label, to]) => <li key={label}><Link to={to} className="transition hover:text-accent">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>&copy; 2026 Kabadi Connect. Hackathon demonstration - all data is mock data.</p>
          <p>Made for cleaner cities.</p>
        </div>
      </div>
    </footer>
  )
}
