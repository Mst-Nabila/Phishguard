import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  Link2,
  KeyRound,
  Clock,
  Globe,
  Lock,
  Database,
  ListChecks,
  Activity,
  Eye,
  ArrowRight,
  Layers,
  Search,
  FileText,
} from 'lucide-react'
import UrlForm from '../components/UrlForm'
import { loadHistory, summarizeHistory } from '../utils/history'
import './Home.css'

const threats = [
  {
    icon: KeyRound,
    title: 'Fake login pages',
    text: 'Attackers copy the look of a bank, email or social site to steal your username and password.',
  },
  {
    icon: Link2,
    title: 'Deceptive links',
    text: 'A link can display one name but lead to another. Look-alike domains and long subdomains hide the real destination.',
  },
  {
    icon: Clock,
    title: 'Urgency and pressure',
    text: 'Messages claiming your account will be closed push you to click before you think.',
  },
]

const features = [
  {
    icon: ListChecks,
    title: 'Transparent heuristics',
    text: 'Every indicator found in a URL is listed with a plain-language explanation and its score impact.',
  },
  {
    icon: Database,
    title: 'Threat intelligence',
    text: 'When configured, URLs are checked against Google Safe Browsing, URLhaus and VirusTotal.',
  },
  {
    icon: Eye,
    title: 'No link opening',
    text: 'The server never visits the submitted address. Analysis uses the URL text and trusted services only.',
  },
  {
    icon: Activity,
    title: 'Risk score 0 to 100',
    text: 'A clear score with three bands: Low Risk, Suspicious and High Risk.',
  },
  {
    icon: Layers,
    title: 'Honest results',
    text: 'Checks that are unavailable are labelled as such. An unchecked URL is never called verified safe.',
  },
  {
    icon: FileText,
    title: 'Local scan history',
    text: 'Past scans are saved in your own browser, with search, filters and a clear-history option.',
  },
]

const steps = [
  { icon: Link2, title: 'Paste a URL', text: 'Copy a suspicious link and paste it into the scanner. Do not click it.' },
  { icon: Search, title: 'We analyse it', text: 'The engine inspects the structure of the address and queries threat intelligence.' },
  { icon: Activity, title: 'Get a risk score', text: 'You receive a 0 to 100 score with every indicator explained.' },
  { icon: ShieldCheck, title: 'Decide safely', text: 'Follow the recommended action and verify through the official website.' },
]

const checks = [
  { icon: Lock, text: 'HTTPS usage (never treated as proof of safety)' },
  { icon: Globe, text: 'IP-address hostnames and unusual ports' },
  { icon: Layers, text: 'Excessive or misleading subdomains' },
  { icon: Link2, text: 'URL length and unusual character patterns' },
  { icon: KeyRound, text: 'Sensitive keywords such as login or verify' },
  { icon: Database, text: 'Known malicious URLs from threat feeds' },
]

export default function Home() {
  const stats = useMemo(() => summarizeHistory(loadHistory()), [])

  const statCards = [
    { label: 'URLs scanned', value: stats.total, tone: 'blue' },
    { label: 'Low risk', value: stats.low, tone: 'green' },
    { label: 'Suspicious', value: stats.suspicious, tone: 'amber' },
    { label: 'High risk', value: stats.high, tone: 'red' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Phishing
            detection
          </span>
          <h1 className="hero-title">
            Protect Your <span className="gradient-text">Digital World.</span>
          </h1>
          <p className="hero-sub">
            Paste a link and PhishGuard checks it for phishing indicators and known threats before
            you click.
          </p>
          <UrlForm />
        </div>
      </section>

      {/* What is phishing */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The threat</span>
            <h2>Phishing tricks people, not computers</h2>
            <p className="muted">
              Phishing is a fraud technique where attackers pose as trusted organisations to steal
              passwords, payment details or personal data. It usually starts with a link.
            </p>
          </div>
          <div className="grid-3">
            {threats.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass hoverable card">
                <span className="icon-box tone-red">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats from the user's own scans */}
      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Your activity</span>
            <h2>Security statistics</h2>
            <p className="muted">
              These numbers are calculated from the scans saved in this browser, not from invented
              claims.
            </p>
          </div>
          <div className="grid-4">
            {statCards.map((item) => (
              <div key={item.label} className={`glass stat tone-${item.tone}`}>
                <span className="stat-value">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
          </div>
          {stats.total === 0 && (
            <p className="muted stat-empty">
              No scans yet. <Link to="/scanner">Scan your first URL</Link> and the numbers will
              appear here.
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Features</span>
            <h2>Built to be clear and honest</h2>
            <p className="muted">
              Useful detection with explanations you can understand, and no false promises.
            </p>
          </div>
          <div className="grid-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass hoverable card">
                <span className="icon-box tone-blue">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Four simple steps</h2>
          </div>
          <ol className="steps">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="glass step">
                <span className="step-number">{index + 1}</span>
                <Icon size={24} className="step-icon" />
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Threat protection */}
      <section className="section">
        <div className="container protect">
          <div>
            <span className="eyebrow">Threat protection</span>
            <h2>What PhishGuard checks</h2>
            <p className="muted">
              Two kinds of evidence are combined and always labelled separately. Heuristic analysis
              looks for suspicious patterns in the URL. Threat intelligence checks whether trusted
              databases already list the URL as malicious.
            </p>
            <div className="notice">
              <ShieldAlert size={20} />
              <p>
                A low score does not guarantee a website is safe. Automated analysis can miss new
                or targeted attacks.
              </p>
            </div>
          </div>
          <ul className="check-list glass">
            {checks.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="icon-box tone-blue small">
                  <Icon size={18} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to action */}
      <section className="section cta-section">
        <div className="container">
          <div className="glass cta">
            <h2>Got a link you are unsure about?</h2>
            <p className="muted">Scan it first. It only takes a moment and costs nothing.</p>
            <Link to="/scanner" className="btn btn-primary">
              <ScanSearch size={18} /> Open the scanner <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
