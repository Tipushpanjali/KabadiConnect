import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Guard from './Guard'
import { DashboardSkeleton } from '../components/ui'

const L = (f) => lazy(f)
const Landing = L(() => import('../pages/public/Landing'))
const HowItWorks = L(() => import('../pages/public/HowItWorks'))
const PublicImpact = L(() => import('../pages/public/PublicImpact'))
const About = L(() => import('../pages/public/About'))
const Contact = L(() => import('../pages/public/Contact'))
const Privacy = L(() => import('../pages/public/Privacy'))
const Terms = L(() => import('../pages/public/Terms'))
const NotFound = L(() => import('../pages/public/NotFound'))
const FindRecycler = L(() => import('../pages/user/FindRecycler'))
const RecyclerDetail = L(() => import('../pages/user/RecyclerDetail'))
const Leaderboard = L(() => import('../pages/user/Leaderboard'))
const Help = L(() => import('../pages/user/Help'))
const Login = L(() => import('../pages/auth/Login'))
const Register = L(() => import('../pages/auth/Register'))
const Forgot = L(() => import('../pages/auth/ForgotPassword'))
const Reset = L(() => import('../pages/auth/ResetPassword'))

const UDash = L(() => import('../pages/user/Dashboard'))
const RequestPickup = L(() => import('../pages/user/RequestPickup'))
const MyPickups = L(() => import('../pages/user/MyPickups'))
const PickupDetails = L(() => import('../pages/user/PickupDetails'))
const History = L(() => import('../pages/user/History'))
const Impact = L(() => import('../pages/user/Impact'))
const Rewards = L(() => import('../pages/user/Rewards'))
const Profile = L(() => import('../pages/user/Profile'))
const Notifications = L(() => import('../pages/user/Notifications'))

const RDash = L(() => import('../pages/recycler/Dashboard'))
const Requests = L(() => import('../pages/recycler/Requests'))
const ActivePickups = L(() => import('../pages/recycler/ActivePickups'))
const Transactions = L(() => import('../pages/recycler/Transactions'))
const Earnings = L(() => import('../pages/recycler/Earnings'))
const Rates = L(() => import('../pages/recycler/Rates'))
const Verification = L(() => import('../pages/recycler/Verification'))
const Ratings = L(() => import('../pages/recycler/Ratings'))
const RSettings = L(() => import('../pages/recycler/Settings'))

const SDash = L(() => import('../pages/society/Dashboard'))
const Households = L(() => import('../pages/society/Households'))
const Analytics = L(() => import('../pages/society/Analytics'))
const Challenge = L(() => import('../pages/society/Challenge'))

const ADash = L(() => import('../pages/admin/Dashboard'))
const AUsers = L(() => import('../pages/admin/Users'))
const ARecyclers = L(() => import('../pages/admin/Recyclers'))
const ASocieties = L(() => import('../pages/admin/Societies'))
const ARequests = L(() => import('../pages/admin/Requests'))
const AReports = L(() => import('../pages/admin/Reports'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-8 pt-24"><DashboardSkeleton /></div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/find-recycler" element={<FindRecycler />} />
          <Route path="/recyclers/:id" element={<RecyclerDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/impact" element={<PublicImpact />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password" element={<Reset />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<Guard role="user" />}>
          <Route path="/user" element={<DashboardLayout role="user" />}>
            <Route path="dashboard" element={<UDash />} />
            <Route path="find-recycler" element={<FindRecycler />} />
            <Route path="recyclers/:id" element={<RecyclerDetail />} />
            <Route path="request-pickup" element={<RequestPickup />} />
            <Route path="pickups" element={<MyPickups />} />
            <Route path="pickups/:id" element={<PickupDetails />} />
            <Route path="history" element={<History />} />
            <Route path="impact" element={<Impact />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<Guard role="recycler" />}>
          <Route path="/recycler" element={<DashboardLayout role="recycler" />}>
            <Route path="dashboard" element={<RDash />} />
            <Route path="requests" element={<Requests />} />
            <Route path="pickups" element={<ActivePickups />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="rates" element={<Rates />} />
            <Route path="verification" element={<Verification />} />
            <Route path="ratings" element={<Ratings />} />
            <Route path="settings" element={<RSettings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<Guard role="society" />}>
          <Route path="/society" element={<DashboardLayout role="society" />}>
            <Route path="dashboard" element={<SDash />} />
            <Route path="households" element={<Households />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="challenge" element={<Challenge />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<Guard role="admin" />}>
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route path="dashboard" element={<ADash />} />
            <Route path="users" element={<AUsers />} />
            <Route path="recyclers" element={<ARecyclers />} />
            <Route path="societies" element={<ASocieties />} />
            <Route path="requests" element={<ARequests />} />
            <Route path="reports" element={<AReports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
