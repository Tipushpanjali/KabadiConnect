import { LifeBuoy } from 'lucide-react'
import { Button, Card } from '../../components/ui'

export default function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Contact us</h1>
      <p className="mt-2 text-muted">Public email delivery has not been configured for this project.</p>
      <div className="mt-8 max-w-xl">
        <Card>
          <LifeBuoy size={28} className="text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">Need help with an account or pickup?</h2>
          <p className="mt-2 text-sm text-muted">Sign in to submit a support report. It will be stored in the support queue for an administrator to review.</p>
          <div className="mt-5 flex gap-3"><Button to="/login">Sign in</Button><Button to="/help" variant="outline">Help articles</Button></div>
        </Card>
      </div>
    </div>
  )
}
