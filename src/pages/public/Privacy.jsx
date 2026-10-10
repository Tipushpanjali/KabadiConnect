const S = [
  ['Information stored', 'When connected to a configured Supabase project, the service stores authentication identifiers, profile details, pickup addresses and requests, recycler business and verification records, notifications, rewards activity, and support reports.'],
  ['How information is used', 'Data is used to authenticate accounts, arrange and track pickups, support recycler verification, maintain points and redemption records, and respond to support reports.'],
  ['Access controls', 'Database row-level security restricts records by account and role. Recycler identity documents are stored in a private bucket and opened through short-lived signed links.'],
  ['Your choices', 'You can update permitted profile fields in Profile & Settings. Account deletion and complete data export are not currently self-service; contact the project operator for these requests.'],
  ['Configuration status', 'Actual data handling depends on the Supabase project, email provider, OAuth providers, and deployment configuration selected by the project operator.'],
]
export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 1 October 2026</p>
      <div className="mt-8 space-y-6">{S.map(([t, d]) => <section key={t}><h2 className="text-lg font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></section>)}</div>
    </div>
  )
}
