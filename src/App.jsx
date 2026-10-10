import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import { ToastHost } from './components/ui'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <AppRoutes />
        <ToastHost />
      </AppProvider>
    </BrowserRouter>
  )
}
