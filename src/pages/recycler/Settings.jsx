import { useEffect, useState } from 'react'
import { Button, Card, PageHeader, TextField, Toggle } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function RecyclerSettings() {
  const { session, recyclerProfile, updateRecycler } = useApp()
  const [s, setS] = useState({ available: false, business: '', details: '', serviceAreas: '', phone: '' })
  const [err, setErr] = useState('')
  useEffect(() => {
    if (recyclerProfile) setS({ available: recyclerProfile.available, business: recyclerProfile.business_name || '', details: recyclerProfile.business_details || '', serviceAreas: (recyclerProfile.service_areas || []).join(', '), phone: recyclerProfile.contact_phone || '' })
  }, [recyclerProfile])
  const save = async (event) => {
    event.preventDefault()
    if (s.business.trim().length < 2) return setErr('Enter your recycler business name.')
    const result = await updateRecycler({ business_name: s.business.trim(), business_details: s.details.trim() || null, service_areas: s.serviceAreas.split(',').map((a) => a.trim()).filter(Boolean), contact_phone: s.phone.trim() || null, available: s.available })
    if (result !== false) setErr('')
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" subtitle={`Preferences for ${session.name}`} />
      <form onSubmit={save} className="space-y-6">
        <Card>
          <h2 className="font-semibold">Business profile</h2>
          <div className="mt-4 grid gap-4"><TextField id="biz" label="Business name" value={s.business} onChange={(e) => setS({ ...s, business: e.target.value })} error={err} />
            <label className="block"><span className="label">About your service</span><textarea className="input" rows={3} value={s.details} onChange={(e) => setS({ ...s, details: e.target.value })} /></label>
            <TextField id="areas" label="Service areas" hint="Separate neighborhood names with commas." value={s.serviceAreas} onChange={(e) => setS({ ...s, serviceAreas: e.target.value })} />
            <TextField id="phone" label="Business contact phone" type="tel" value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} />
          </div>
          <div className="mt-4 border-t border-line pt-2"><Toggle label="Accepting new pickups" desc="Verified and available businesses appear in recycler search." checked={s.available} onChange={(v) => setS({ ...s, available: v })} /></div>
        </Card>
        <Button type="submit">Save business settings</Button>
      </form>
    </div>
  )
}
