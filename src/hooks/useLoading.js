import { useEffect, useState } from 'react'

// Shows a short skeleton state on first render so loading UI is visible in the demo.
export default function useLoading(ms = 550) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}
