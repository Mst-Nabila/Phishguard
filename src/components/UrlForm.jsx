import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, Link2 } from 'lucide-react'
import { normalizeUrl } from '../utils/url'
import './UrlForm.css'

export default function UrlForm({ initialValue = '' }) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const result = normalizeUrl(value)
    if (result.error) {
      setError(result.error)
      return
    }
    setError('')
    navigate(`/scanner?url=${encodeURIComponent(result.url)}`)
  }

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className={`url-form-row ${error ? 'has-error' : ''}`}>
        <Link2 size={20} className="url-form-icon" aria-hidden="true" />
        <input
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          className="url-form-input"
          placeholder="Paste a link, e.g. https://example.com/login"
          aria-label="URL to scan"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'url-form-error' : undefined}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
        />
        <button type="submit" className="btn btn-primary url-form-btn">
          <ScanSearch size={18} /> Scan Now
        </button>
      </div>
      {error && (
        <p id="url-form-error" className="url-form-error" role="alert">
          {error}
        </p>
      )}
      <p className="url-form-note">
        PhishGuard never opens the link. It only analyses the address itself.
      </p>
    </form>
  )
}
