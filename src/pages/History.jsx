import { History as HistoryIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function History() {
  return (
    <div className="page container">
      <PageHeader
        eyebrow="History"
        title="Scan History"
        description="Review, search and filter your previous scans."
      />
      <div className="glass placeholder">
        <HistoryIcon size={40} />
        <h3>History coming in Stage 6</h3>
        <p className="muted">Your scans will be saved in this browser only.</p>
      </div>
    </div>
  )
}
