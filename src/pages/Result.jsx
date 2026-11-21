import { useParams } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Result() {
  const { id } = useParams()

  return (
    <div className="page container">
      <PageHeader
        eyebrow="Scan result"
        title="Scan Result"
        description="Detailed breakdown of a single scan."
      />
      <div className="glass placeholder">
        <FileSearch size={40} />
        <h3>Result page coming in Stage 5</h3>
        <p className="muted">
          Scan ID: <span className="mono">{id}</span>
        </p>
      </div>
    </div>
  )
}
