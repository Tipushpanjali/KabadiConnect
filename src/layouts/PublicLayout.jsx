import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function PublicLayout() {
  return (
    <div className="min-h-screen" id="top">
      <Navbar />
      <main className="pt-16">
        <PageTransition><Outlet /></PageTransition>
      </main>
      <Footer />
    </div>
  )
}
