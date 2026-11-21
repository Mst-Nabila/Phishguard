import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ScanSearch } from 'lucide-react'
import Logo from './Logo'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/scanner', label: 'Scanner' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close} aria-label="PhishGuard home">
          <Logo />
        </Link>

        <nav
          id="primary-nav"
          className={`navbar-links ${open ? 'is-open' : ''}`}
          aria-label="Primary"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={close}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/scanner" className="btn btn-primary nav-cta" onClick={close}>
            <ScanSearch size={18} /> Scan a URL
          </Link>
        </nav>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
