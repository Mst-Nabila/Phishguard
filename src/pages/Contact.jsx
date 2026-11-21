import { Mail } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Contact() {
  return (
    <div className="page container">
      <PageHeader
        eyebrow="Contact"
        title="Contact Us"
        description="Questions, feedback or reports about PhishGuard."
      />
      <div className="glass placeholder">
        <Mail size={40} />
        <h3>Contact form coming in Stage 8</h3>
      </div>
    </div>
  )
}
