import { Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function About() {
  return (
    <div className="page container">
      <PageHeader
        eyebrow="About"
        title="About PhishGuard"
        description="What PhishGuard is, how detection works and the technology behind it."
      />
      <div className="glass placeholder">
        <Info size={40} />
        <h3>About page coming in Stage 8</h3>
      </div>
    </div>
  )
}
