import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, KeyRound, LogOut, MapPin, Pencil, Settings2, User } from 'lucide-react'
import { Avatar, Button, Card, PageHeader, SelectField, TextField, Toggle } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { isEmail } from '../../utils'

export default function Profile() {
  const { profile, updateProfile, toast, logout, session, preferences, updatePreferences, changePassword } = useApp()
  const nav = useNavigate()
  const [edit, setEdit] = useState(false)
  const [f, setF] = useState(profile)
  const [err, setErr] = useState({})
  const [notif, setNotif] = useState(preferences)
  const [pw, setPw] = useState({ cur: '', next: '', conf: '' })
  const [pwErr, setPwErr] = useState({})
  const [pref, setPref] = useState({ lang: 'English', loc: 'Home', units: 'kg' })
  useEffect(() => { setF(profile); setNotif(preferences) }, [profile, preferences])

  const save = async () => {
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your name.'
    if (f.address.trim().length < 10) er.address = 'Enter your full address.'
    setErr(er)
    if (Object.keys(er).length) return
    if (await updateProfile(f) !== false) setEdit(false)
  }
  const savePw = async (e) => {
    e.preventDefault()
    const er = {}
    if (!pw.cur) er.cur = 'Enter your current password.'
    if (pw.next.length < 8) er.next = 'Use at least 8 characters.'
    if (pw.conf !== pw.next) er.conf = 'Passwords do not match.'
    setPwErr(er)
    if (!Object.keys(er).length && await changePassword(pw.cur, pw.next) !== false) setPw({ cur: '', next: '', conf: '' })
  }
  const preference = (key, value) => {
    const next = { ...notif, [key]: value }
    updatePreferences(next).then((ok) => { if (ok !== false) setNotif(next) })
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Profile & settings" subtitle="Manage your details, notifications and preferences." />
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4"><Avatar name={profile.name} size={60} /><div><p className="text-lg font-semibold">{profile.name}</p><p className="text-sm text-muted">{profile.email}</p></div></div>
          {edit ? <div className="flex gap-2"><Button variant="ghost" onClick={() => { setEdit(false); setF(profile); setErr({}) }}>Cancel</Button><Button onClick={save}><Check size={16} />Save changes</Button></div> : <Button variant="outline" onClick={() => { setF(profile); setEdit(true) }}><Pencil size={16} />Edit profile</Button>}
        </div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><User size={16} className="text-accent" />Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="pn" label="Full name" value={f.name} disabled={!edit} error={err.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <TextField id="pe" label="Email" value={f.email} disabled hint="Email changes require a separate confirmation flow." />
          <TextField id="pp" label="Phone" value={f.phone} disabled={!edit} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <TextField id="ps" label="Society" value={f.society || ''} disabled hint="Society membership is managed by your society." />
        </div>
        <h2 className="mb-3 mt-6 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} className="text-accent" />Address</h2>
        <label htmlFor="pa" className="label">Pickup address</label>
        <textarea id="pa" rows={3} className={`input ${err.address ? '!border-bad' : ''}`} value={f.address} disabled={!edit} onChange={(e) => setF({ ...f, address: e.target.value })} />
        {err.address && <p role="alert" className="mt-1 text-xs text-bad">{err.address}</p>}
        <SelectField id="pl" className="mt-4 max-w-xs" label="Preferred pickup location" value={pref.loc} onChange={(e) => { setPref({ ...pref, loc: e.target.value }); toast('Preference saved', 'info') }}><option>Home</option><option>Society gate</option><option>Parking area</option></SelectField>
      </Card>
      <Card>
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Bell size={16} className="text-accent" />Notification settings</h2>
        <div className="divide-y divide-line">
          <Toggle label="Pickup updates" desc="Accepted, on the way, collected, completed" checked={notif.pickup} onChange={(v) => preference('pickup', v)} />
          <Toggle label="Green Points" desc="Points earned and rewards unlocked" checked={notif.points} onChange={(v) => preference('points', v)} />
          <Toggle label="Society challenge" desc="Ranking changes and monthly targets" checked={notif.society} onChange={(v) => preference('society', v)} />
          <Toggle label="Offers and tips" desc="Partner offers and recycling tips" checked={notif.promo} onChange={(v) => preference('promo', v)} />
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><KeyRound size={16} className="text-accent" />Password</h2>
        <form onSubmit={savePw} noValidate className="grid gap-4 sm:grid-cols-3">
          <TextField id="cp1" label="Current" type="password" autoComplete="current-password" value={pw.cur} error={pwErr.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} />
          <TextField id="cp2" label="New" type="password" autoComplete="new-password" value={pw.next} error={pwErr.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          <TextField id="cp3" label="Confirm new" type="password" autoComplete="new-password" value={pw.conf} error={pwErr.conf} onChange={(e) => setPw({ ...pw, conf: e.target.value })} />
          <div className="sm:col-span-3"><Button type="submit" variant="outline">Update password</Button></div>
        </form>
      </Card>
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Settings2 size={16} className="text-accent" />Account preferences</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="lg" label="Language" value={pref.lang} onChange={(e) => { setPref({ ...pref, lang: e.target.value }); toast('Language preference saved', 'info') }}><option>English</option><option>Hindi</option></SelectField>
          <SelectField id="un" label="Weight units" value={pref.units} onChange={(e) => setPref({ ...pref, units: e.target.value })}><option value="kg">Kilograms (kg)</option></SelectField>
        </div>
        <div className="mt-6 border-t border-line pt-5"><Button variant="danger" onClick={async () => { try { await logout(); nav('/login') } catch (error) { toast(error.message || 'Logout failed.', 'error') } }}><LogOut size={16} />Logout</Button></div>
      </Card>
    </div>
  )
}
