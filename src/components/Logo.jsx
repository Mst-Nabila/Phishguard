import { ShieldCheck } from 'lucide-react'
import './Logo.css'

export default function Logo({ size = 22 }) {
  return (
    <span className="logo">
      <span className="logo-mark">
        <ShieldCheck size={size} strokeWidth={2.2} />
      </span>
      <span className="logo-text">
        Phish<span className="gradient-text">Guard</span>
      </span>
    </span>
  )
}
