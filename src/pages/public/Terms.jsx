const S = [
  ['Service status', 'This software is under active development. Availability and operational readiness depend on configuration and validation by the project operator.'],
  ['Using the platform', 'Users must provide accurate account, pickup, and business information. Recycler verification is limited to the documents and review workflow configured by the operator.'],
  ['Rates and settlement', 'Displayed pickup values are estimates based on a recycler rate and requested quantity. Final settlement values are recalculated from the measured quantity. The application does not process cash payments or provide a payment gateway.'],
  ['Green Points', 'Green Points are application records, separate from cash earnings. Reward fulfillment depends on the listed reward provider and any configured redemption process.'],
  ['Environmental estimates', 'Impact numbers are estimates based on illustrative factors and are not audited or certified measurements.'],
  ['Changes', 'We may update these terms. Continued use means you accept the updated terms.'],
]
export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 1 October 2026</p>
      <div className="mt-8 space-y-6">{S.map(([t, d]) => <section key={t}><h2 className="text-lg font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></section>)}</div>
    </div>
  )
}
