import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { Button } from './ui'
import { useApp } from '../context/AppContext'
import { ROLE_HOME } from '../utils'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/find-recycler', label: 'Find Recycler' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/impact', label: 'Impact' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { session } = useApp()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const link = ({ isActive }) => `rounded-lg px-3 py-2 text-sm transition ${isActive ? 'text-accent' : 'text-muted hover:text-ink'}`
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled || open ? 'glass shadow-soft' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={link}>{l.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <Button to={ROLE_HOME[session.role]}>Open Dashboard</Button>
          ) : (
            <>
              <Button to="/login" variant="ghost">Login</Button>
              <Button to="/register">Get Started</Button>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line lg:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-xl px-4 py-3 ${isActive ? 'bg-accent/10 text-accent' : 'text-ink'}`}>{l.label}</NavLink>)}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {session ? <Button to={ROLE_HOME[session.role]} className="col-span-2">Open Dashboard</Button> : (
                  <>
                    <Button to="/login" variant="outline">Login</Button>
                    <Button to="/register">Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
