import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  History as HistoryIcon,
  Info,
  FileSearch,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { getScan } from '../utils/history'
import './Result.css'

const LEVEL_TEXT = {
  low: 'No strong phishing indicators were found in the address. This is not a guarantee of safety.',
  suspicious: 'Some indicators look unusual. Treat this link with caution.',
  high: 'Several strong indicators of phishing were found. Do not trust this link.',
}

const BASIS_TEXT = {
  heuristics_only: {
    title: 'Heuristic analysis only',
    text: 'This score is based on patterns in the URL text. No threat intelligence provider was available, so the URL was not checked against known malicious lists.',
  },
  heuristics_and_threat_intelligence: {
    title: 'Heuristics and threat intelligence',
    text: 'This score combines patterns in the URL with checks against threat intelligence providers.',
  },
  threat_intelligence: {
    title: 'Confirmed by threat intelligence',
    text: 'A threat intelligence provider lists this URL as malicious, which overrides the heuristic score.',
  },
}

const PROVIDER_STATUS = {
  not_configured: { label: 'Not configured', tone: 'neutral' },
  clean: { label: 'No match found', tone: 'safe' },
  malicious: { label: 'Listed as malicious', tone: 'danger' },
  error: { label: 'Unavailable (error)', tone: 'neutral' },
  timeout: { label: 'Unavailable (timed out)', tone: 'neutral' },
}

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString()
}

export default function Result() {
  const { id } = useParams()
  const location = useLocation()

  const result = useMemo(() => {
    const fromState = location.state?.result
    if (fromState && fromState.id === id) return fromState
    return getScan(id)
  }, [id, location.state])

  if (!result) {
    return (
      <div className="page container">
        <PageHeader
          eyebrow="Scan result"
          title="Result not found"
          description="We could not find a scan with this ID."
        />
        <div className="glass placeholder">
          <FileSearch size={40} />
          <h3>This scan is not available</h3>
          <p className="muted">
            Scan history is stored only in this browser. The result may have been cleared, or it
            was created on another device.
          </p>
          <Link to="/scanner" className="btn btn-primary">
            <ScanSearch size={18} /> Scan a URL
          </Link>
        </div>
      </div>
    )
  }

  const score = Math.max(0, Math.min(100, Number(result.score) || 0))
  const level = LEVEL_TEXT[result.level] ? result.level : 'low'
  const indicators = Array.isArray(result.indicators) ? result.indicators : []
  const providers = Array.isArray(result.threatIntelligence) ? result.threatIntelligence : []
  const recommendations = Array.isArray(result.recommendations) ? result.recommendations : []
  const notes = Array.isArray(result.notes) ? result.notes : []
  const structure = result.structure || {}
  const basis = BASIS_TEXT[result.basis] || BASIS_TEXT.heuristics_only
  const subdomains = Array.isArray(structure.subdomains) ? structure.subdomains : []
  const urlLength = Number(structure.length) || String(result.normalizedUrl || '').length
  const LevelIcon = level === 'low' ? ShieldCheck : ShieldAlert

  const tiles = [
    {
      label: 'Connection',
      value: structure.protocol === 'https' ? 'HTTPS' : 'HTTP (not encrypted)',
      warn: structure.protocol !== 'https',
      note: 'HTTPS does not prove a site is safe.',
    },
    {
      label: 'Host type',
      value: structure.isIpAddress ? 'IP address' : 'Domain name',
      warn: Boolean(structure.isIpAddress),
    },
    {
      label: 'Subdomain levels',
      value: String(subdomains.length),
      warn: subdomains.length >= 3,
    },
    {
      label: 'URL length',
      value: `${urlLength} characters`,
      warn: urlLength >= 75,
    },
  ]

  const structureRows = [
    ['Protocol', structure.protocol || 'Unknown'],
    ['Hostname', structure.hostname || 'Unknown'],
    ['Registrable domain', structure.registrableDomain || 'Not applicable (IP address)'],
    ['Subdomains', subdomains.length ? subdomains.join('.') : 'None'],
    ['Port', structure.port || 'Default'],
    ['Path', structure.path || '/'],
  ]

  return (
    <div className={`page container result level-${level}`}>
      <PageHeader
        eyebrow="Scan result"
        title="Scan Result"
        description={`Scanned on ${formatDate(result.scannedAt)}`}
      />

      <div className="result-top">
        <section className="glass summary" aria-label="Risk summary">
          <div className="gauge">
            <svg viewBox="0 0 120 120" className="gauge-svg" aria-hidden="true">
              <circle cx="60" cy="60" r={RADIUS} className="gauge-track" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                className="gauge-fill"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="gauge-value">
              <strong>{score}</strong>
              <span>out of 100</span>
            </div>
          </div>
          <span className="level-badge">
            <LevelIcon size={18} /> {result.label || 'Low Risk'}
          </span>
          <p className="summary-text">{LEVEL_TEXT[level]}</p>
          {Number.isFinite(Number(result.heuristicScore)) && (
            <p className="muted summary-small">Heuristic score: {result.heuristicScore}/100</p>
          )}
        </section>

        <section className="glass details" aria-label="Submitted URL">
          <h2>Submitted URL</h2>
          <div className="url-box">{result.submittedUrl || result.normalizedUrl}</div>
          <p className="muted summary-small">
            The URL is shown as plain text and is not clickable on purpose.
          </p>
          <div className="basis">
            <Info size={18} />
            <div>
              <strong>{basis.title}</strong>
              <p>{basis.text}</p>
            </div>
          </div>
          <dl className="meta-list">
            {structureRows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className="mono">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {level === 'low' && (
        <div className="result-notice" role="note">
          <ShieldAlert size={20} />
          <p>
            A low-risk score does not guarantee that this website is safe. Automated analysis can
            miss new or targeted attacks.
          </p>
        </div>
      )}

      <section className="result-section">
        <h2>Security indicators</h2>
        <div className="tiles">
          {tiles.map((tile) => (
            <div key={tile.label} className={`glass tile ${tile.warn ? 'is-warn' : ''}`}>
              <span className="tile-label">{tile.label}</span>
              <strong>{tile.value}</strong>
              {tile.note && <span className="tile-note">{tile.note}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="result-section">
        <h2>Detection details</h2>
        {indicators.length === 0 ? (
          <div className="glass empty-note">
            <p>
              No suspicious patterns were detected in the structure of this URL. This only means
              the address looks ordinary, not that the site is trustworthy.
            </p>
          </div>
        ) : (
          <ul className="indicator-list">
            {indicators.map((item) => (
              <li key={item.id} className={`glass indicator sev-${item.severity}`}>
                <div className="indicator-top">
                  <strong>{item.label}</strong>
                  <span className="chip">+{item.points} points</span>
                </div>
                <p className="muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="result-section">
        <h2>Threat intelligence</h2>
        <ul className="provider-list glass">
          {providers.map((provider) => {
            const status = PROVIDER_STATUS[provider.status] || {
              label: 'Unknown',
              tone: 'neutral',
            }
            return (
              <li key={provider.id} className="provider">
                <div>
                  <strong>{provider.name}</strong>
                  <p className="muted">{provider.detail}</p>
                </div>
                <span className={`chip tone-${status.tone}`}>{status.label}</span>
              </li>
            )
          })}
        </ul>
        <p className="muted summary-small">
          "No match found" means the URL is not listed in that database. It does not mean the URL
          is safe. Providers that are not configured or unavailable were not checked.
        </p>
      </section>

      {notes.length > 0 && (
        <section className="result-section">
          <h2>Notes</h2>
          <ul className="plain-list glass">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="result-section">
        <h2>Recommended action</h2>
        <ul className="plain-list glass">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="result-actions">
        <Link to="/scanner" className="btn btn-primary">
          <ScanSearch size={18} /> Scan another URL
        </Link>
        <Link to="/history" className="btn btn-ghost">
          <HistoryIcon size={18} /> View history
        </Link>
      </div>
    </div>
  )
}
