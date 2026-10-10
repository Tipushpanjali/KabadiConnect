import { useState } from 'react'
import { CheckCircle2, CreditCard, MessageCircle, Package, Flag } from 'lucide-react'
import { Accordion, Button, Card, EmptyState, Modal, PageHeader, SearchInput, SelectField, TextField } from '../../components/ui'
import { FAQS } from '../../data/mock'
import { useApp } from '../../context/AppContext'

export default function Help() {
  const { session, createReport } = useApp()
  const [q, setQ] = useState('')
  const [rep, setRep] = useState(false)
  const [done, setDone] = useState(null)
  const [f, setF] = useState({ type: 'Pickup problem', text: '' })
  const [err, setErr] = useState('')
  const list = FAQS.filter((x) => `${x.q} ${x.a}`.toLowerCase().includes(q.toLowerCase()))
  const send = async (e) => {
    e.preventDefault()
    if (f.text.trim().length < 10) return setErr('Describe the issue in at least 10 characters.')
    setErr('')
    const result = await createReport(f.type, f.text.trim())
    if (result) setDone(result)
    else setErr('Could not submit this report. Please retry.')
  }
  const close = () => { setRep(false); setDone(false); setF({ type: 'Pickup problem', text: '' }); setErr('') }
  return (
    <div className={session ? '' : 'mx-auto max-w-4xl px-4 py-10 sm:px-6'}>
      <PageHeader title="Help & Support" subtitle="Find answers fast, or reach our team." />
      <SearchInput value={q} onChange={setQ} placeholder="Search help articles" className="mb-6 max-w-xl" />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[[Package, 'Pickup not arrived', 'Check My Pickups for status, then contact your recycler.'], [CreditCard, 'Payment mismatch', 'Compare the weight on your receipt with the estimate.'], [MessageCircle, 'Points missing', 'Points are added once a pickup is marked Completed.']].map(([Ic, t, d]) => (
          <Card key={t} hover><Ic className="text-accent" aria-hidden="true" /><h2 className="mt-3 font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></Card>
        ))}
      </div>
      <h2 className="mb-3 text-lg font-semibold">Frequently asked questions</h2>
      {list.length ? <Accordion items={list} /> : <EmptyState icon="Inbox" title="No results found" text={`Nothing matched "${q}". Try a different word or contact support.`} action={<Button variant="outline" onClick={() => setQ('')}>Clear search</Button>} />}
      <Card className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-semibold">Still need help?</h2><p className="text-sm text-muted">Our support team replies within one working day.</p></div>
        <div className="flex flex-wrap gap-2">{session ? <Button onClick={() => setRep(true)}><Flag size={16} />Report an issue</Button> : <Button to="/login"><Flag size={16} />Sign in to report an issue</Button>}</div>
      </Card>
      <Modal open={rep} onClose={close} title="Report an issue">
        {done ? (
          <div className="py-4 text-center"><CheckCircle2 size={44} className="mx-auto text-ok" /><p className="mt-3 font-medium">Report submitted</p><p className="mt-1 text-sm text-muted">Reference <span className="font-mono text-accent">{done.id}</span></p><Button className="mt-5" onClick={close}>Done</Button></div>
        ) : (
          <form onSubmit={send} noValidate className="space-y-4">
            <SelectField id="rt" label="Issue type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option>Pickup problem</option><option>Payment problem</option><option>Account problem</option><option>Other</option></SelectField>
            <div><label htmlFor="rd" className="label">What happened?</label><textarea id="rd" rows={4} className={`input ${err ? '!border-bad' : ''}`} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} />{err && <p role="alert" className="mt-1 text-xs text-bad">{err}</p>}</div>
            <Button type="submit" className="w-full">Submit report</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
