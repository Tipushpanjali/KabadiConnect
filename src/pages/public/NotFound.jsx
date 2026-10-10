import { Recycle } from 'lucide-react'
import { Button } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { ROLE_HOME } from '../../utils'

export default function NotFound() {
  const { session } = useApp()
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-3xl border border-line bg-card shadow-glow">
          <Recycle size={52} className="floaty text-accent" aria-hidden="true" />
        </div>
        <p className="mt-6 font-display text-7xl font-extrabold gradient-text">404</p>
        <h1 className="mt-2 text-2xl font-bold">Looks like this waste went missing.</h1>
        <p className="mt-2 text-muted">The page you are looking for was moved, recycled or never existed.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to={session ? ROLE_HOME[session.role] : '/'}>{session ? 'Back to Dashboard' : 'Back to Home'}</Button>
          <Button to="/help" variant="outline">Get help</Button>
        </div>
      </div>
    </div>
  )
}
