import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="page container">
      <div className="glass placeholder">
        <Compass size={40} />
        <h1 style={{ fontSize: '2rem' }}>404: Page not found</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
