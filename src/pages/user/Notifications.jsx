import { CheckCheck, Trash2 } from 'lucide-react'
import { Button, EmptyState, PageHeader, Card } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import { Ico } from '../../utils/icons'

export default function Notifications() {
  const { notifs, markRead, markAllRead, clearNotifs, unread } = useApp()
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Notifications" subtitle={unread ? `${unread} unread` : 'You are all caught up'} actions={notifs.length > 0 && <><Button variant="outline" size="sm" onClick={markAllRead} disabled={!unread}><CheckCheck size={16} />Mark all read</Button><Button variant="ghost" size="sm" onClick={clearNotifs}><Trash2 size={16} />Clear all</Button></>} />
      {notifs.length === 0 ? <EmptyState icon="Bell" title="No notifications" text="Pickup updates, points and challenge news will show up here." /> : (
        <Card className="!p-2">
          <ul className="divide-y divide-line">
            {notifs.map((n) => (
              <li key={n.id}>
                <button onClick={() => markRead(n.id)} className={`flex w-full items-start gap-4 rounded-xl px-3 py-4 text-left transition hover:bg-white/[.03] ${n.read ? '' : 'bg-accent/[.06]'}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${n.read ? 'bg-white/5 text-muted' : 'bg-accent/15 text-accent'}`}><Ico name={n.icon} size={18} /></span>
                  <span className="flex-1"><span className={`block text-sm ${n.read ? 'text-muted' : 'font-medium'}`}>{n.text}</span><span className="text-xs text-muted">{n.time}</span></span>
                  {!n.read && <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" aria-label="Unread" />}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
