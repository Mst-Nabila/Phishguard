import { LayoutDashboard } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  return (
    <div className="page container">
      <PageHeader
        eyebrow="Dashboard"
        title="Security Dashboard"
        description="Statistics calculated from your own scan activity."
      />
      <div className="glass placeholder">
        <LayoutDashboard size={40} />
        <h3>Dashboard coming in Stage 6</h3>
        <p className="muted">Real statistics will appear here once you have scanned URLs.</p>
      </div>
    </div>
  )
}
