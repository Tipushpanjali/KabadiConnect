import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const { pathname } = useLocation()
  return (
    <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
