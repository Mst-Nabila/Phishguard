import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import UrlForm from '../components/UrlForm'
import { scanUrl } from '../services/api'
import { saveScan } from '../utils/history'
import './Scanner.css'

export default function Scanner() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  const [outcome, setOutcome] = useState(null)

  const urlParam = searchParams.get('url') || ''

  // A new key is created for every submission, so scanning the same URL
  // twice (or pressing "Try again") starts a fresh scan.
  const requestKey = `${location.key}|${retryCount}|${urlParam}`
  const loading = Boolean(urlParam) && outcome?.key !== requestKey
  const errorMessage = outcome?.key === requestKey ? outcome.message : ''

  useEffect(() => {
    if (!urlParam) return undefined

    const controller = new AbortController()

    scanUrl(urlParam, controller.signal)
      .then((result) => {
        saveScan(result)
        navigate(`/result/${result.id}`, { replace: true, state: { result } })
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setOutcome({
          key: requestKey,
          message: error?.message || 'The scan failed. Please try again.',
        })
      })

    return () => controller.abort()
  }, [urlParam, requestKey, navigate])

  return (
    <div className="page container">
      <PageHeader
        eyebrow="URL Scanner"
        title="Scan a URL"
        description="Check a link for phishing indicators before you click it."
      />

      {loading ? (
        <div className="glass scan-loading" role="status" aria-live="polite">
          <div className="scan-spinner">
            <ShieldCheck size={30} />
          </div>
          <h3>Analysing the URL...</h3>
          <p className="muted mono scan-url">{urlParam}</p>
          <p className="muted">
            PhishGuard inspects the address text and asks threat intelligence services. It never
            opens the link.
          </p>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="glass scan-error" role="alert">
              <ShieldAlert size={26} />
              <div>
                <h3>The scan could not be completed</h3>
                <p>{errorMessage}</p>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          <UrlForm initialValue={urlParam} />

          <ul className="glass scan-tips">
            <li>Paste the full link. Adding https:// is optional.</li>
            <li>Never click a suspicious link just to test it. Paste it here instead.</li>
            <li>A low score is not a guarantee that a website is safe.</li>
          </ul>
        </>
      )}
    </div>
  )
}
