import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Search, PackagePlus, ClipboardList, History, Leaf, Gift, Trophy, User, Bell, HelpCircle, LogOut, Menu, X,
  Inbox, Truck, Receipt, Wallet, Tag, Star, Settings, ShieldCheck, Users, Building2, BarChart3, FileText, Recycle, ChevronRight, Home,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../components/Logo'
import PageTransition from '../components/PageTransition'
import { Avatar, Dropdown, MenuItem } from '../components/ui'
import { useApp } from '../context/AppContext'
import { ROLE_LABEL } from '../utils'

const NAV = {
  user: {
    main: [
      ['/user/dashboard', 'Dashboard', LayoutDashboard], ['/user/find-recycler', 'Find Recycler', Search], ['/user/request-pickup', 'Request Pickup', PackagePlus],
      ['/user/pickups', 'My Pickups', ClipboardList], ['/user/history', 'History', History], ['/user/impact', 'Impact', Leaf],
      ['/user/rewards', 'Green Points', Gift], ['/user/leaderboard', 'Leaderboard', Trophy],
    ],
    menu: [['/user/profile', 'Profile & Settings', User], ['/user/notifications', 'Notifications', Bell], ['/user/help', 'Help & Support', HelpCircle]],
  },
  recycler: {
    main: [
      ['/recycler/dashboard', 'Dashboard', LayoutDashboard], ['/recycler/requests', 'Incoming Requests', Inbox], ['/recycler/pickups', 'Active Pickups', Truck],
      ['/recycler/transactions', 'Transactions', Receipt], ['/recycler/earnings', 'Earnings', Wallet], ['/recycler/rates', 'Categories & Rates', Tag], ['/recycler/ratings', 'Ratings', Star],
    ],
    menu: [['/recycler/verification', 'Profile / Verification', ShieldCheck], ['/recycler/settings', 'Settings', Settings], ['/help', 'Help & Support', HelpCircle]],
  },
  society: {
    main: [['/society/dashboard', 'Dashboard', LayoutDashboard], ['/society/households', 'Households', Users], ['/society/analytics', 'Analytics', BarChart3], ['/society/challenge', 'Challenge', Trophy]],
    menu: [['/leaderboard', 'Leaderboard', Trophy], ['/help', 'Help & Support', HelpCircle]],
  },
  admin: {
    main: [
      ['/admin/dashboard', 'Dashboard', LayoutDashboard], ['/admin/users', 'Users', Users], ['/admin/recyclers', 'Recyclers', Recycle],
      ['/admin/societies', 'Societies', Building2], ['/admin/requests', 'Pickup Requests', ClipboardList], ['/admin/reports', 'Reports', FileText],
    ],
    menu: [['/help', 'Help & Support', HelpCircle]],
  },
}

export default function DashboardLayout({ role }) {
  const { session, logout, unread, pickups, toast, dataLoading, dataError, refreshData } = useApp()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  const cfg = NAV[role]
  const pendingReq = pickups.filter((p) => p.status === 'Requested').length
  const badge = (to) => (to === '/recycler/requests' && pendingReq ? pendingReq : null)
  const doLogout = () => { logout(); toast('You have been logged out', 'info'); nav('/login') }

  const links = (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {cfg.main.map(([to, label, Ic]) => (
        <NavLink key={to} to={to} end={to.endsWith('dashboard')}
          className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${isActive ? 'bg-accent/10 font-medium text-accent' : 'text-muted hover:bg-white/5 hover:text-ink'}`}>
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId={`active-${open ? 'm' : 'd'}`} className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-accent" />}
              <Ic size={18} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {badge(to) && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-bg">{badge(to)}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-card/50 p-4 backdrop-blur lg:flex">
        <div className="px-2 py-2"><Logo to="/" /></div>
        <div className="mt-6 flex-1 overflow-y-auto">{links}</div>
        <div className="rounded-2xl border border-line bg-bg/60 p-3 text-xs text-muted">
          <p className="font-medium text-ink">Connected account</p>
          <p className="mt-0.5">Account data is loaded from your Kabadi Connect workspace.</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button>
            <span className="lg:hidden"><Logo compact /></span>
            <span className="hidden items-center gap-1 text-sm text-muted sm:flex lg:hidden xl:flex">
              <Home size={14} aria-hidden="true" /><ChevronRight size={14} aria-hidden="true" />{ROLE_LABEL[role]}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {role === 'user' && (
              <Link to="/user/notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} className="relative rounded-xl p-2.5 text-muted transition hover:bg-white/5 hover:text-ink">
                <Bell size={20} />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-bg">{unread}</span>}
              </Link>
            )}
            <Dropdown label="Account menu" trigger={
              <>
                <Avatar name={session?.name} size={34} />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium leading-tight">{session?.name}</span>
                  <span className="block text-xs text-muted">{ROLE_LABEL[role]}</span>
                </span>
              </>
            }>
              {cfg.menu.map(([to, label, Ic]) => <MenuItem key={to} to={to} icon={Ic}>{label}</MenuItem>)}
              <div className="my-1 border-t border-line" />
              <MenuItem icon={LogOut} onClick={doLogout} danger>Logout</MenuItem>
            </Dropdown>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {dataError && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bad/30 bg-bad/10 p-3 text-sm text-bad"><span>Could not load current data: {dataError}</span><button onClick={refreshData} className="font-semibold underline">Retry</button></div>}
            {dataLoading && <p className="mb-3 text-xs text-muted" role="status">Refreshing account data…</p>}
            <PageTransition><Outlet /></PageTransition>
        </main>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'tween', duration: 0.25 }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-card p-4" aria-label="Mobile navigation">
              <div className="flex items-center justify-between px-2 py-2">
                <Logo />
                <button onClick={() => setOpen(false)} aria-label="Close navigation" className="rounded-lg p-2"><X /></button>
              </div>
              <div className="mt-6 flex-1 overflow-y-auto">{links}</div>
              <div className="mt-3 space-y-1 border-t border-line pt-3">
                {cfg.menu.map(([to, label, Ic]) => (
                  <Link key={to} to={to} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-ink"><Ic size={18} aria-hidden="true" />{label}</Link>
                ))}
                <button onClick={doLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-bad hover:bg-bad/10"><LogOut size={18} aria-hidden="true" />Logout</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
