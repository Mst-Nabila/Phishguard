import { ScanSearch } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Scanner() {
  return (
    <div className="page container">
      <PageHeader
        eyebrow="URL Scanner"
        title="Scan a URL"
        description="Check a link for phishing indicators before you click it."
      />
      <div className="glass placeholder">
        <ScanSearch size={40} />
        <h3>Scanner coming in Stage 5</h3>
        <p className="muted">The scanning form and results connect to the backend engine.</p>
      </div>
    </div>
  )
}
