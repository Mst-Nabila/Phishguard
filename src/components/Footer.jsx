import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Logo />
          <p className="muted">
            Protect Your Digital World. PhishGuard combines URL heuristics with threat
            intelligence to help you spot phishing links before you click.
          </p>
        </div>

        <div>
          <h4>Product</h4>
          <ul>
            <li><Link to="/scanner">URL Scanner</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/history">Scan History</Link></li>
          </ul>
        </div>

        <div>
          <h4>Project</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li>
              <a href="https://github.com/Mst-Nabila/Phishguard" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} PhishGuard. A cybersecurity education project.</p>
        <p>
          Automated analysis cannot guarantee that a website is safe. Always use your own
          judgement.
        </p>
      </div>
    </footer>
  )
}
