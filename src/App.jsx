import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import Result from './pages/Result'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="result/:id" element={<Result />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="history" element={<History />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
