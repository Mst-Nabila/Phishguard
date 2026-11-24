import { randomUUID } from 'node:crypto'
import { runHeuristics } from './heuristics.js'
import { classify, heuristicScore, recommendationsFor } from './scoring.js'

// Provider results are added in Stage 7. Until a provider is wired up,
// it is reported honestly as "not_configured" rather than faked.
function pendingProviders() {
  return [
    { id: 'googleSafeBrowsing', name: 'Google Safe Browsing', status: 'not_configured', detail: 'No API key configured.' },
    { id: 'urlhaus', name: 'URLhaus', status: 'not_configured', detail: 'No API key configured.' },
    { id: 'virusTotal', name: 'VirusTotal', status: 'not_configured', detail: 'No API key configured.' },
  ]
}

export async function analyzeUrl(url, providerResults = pendingProviders()) {
  const { indicators, parts } = runHeuristics(url)
  const score = heuristicScore(indicators)

  const threatMatched = providerResults.some((result) => result.status === 'malicious')
  const checkedProviders = providerResults.filter((result) =>
    ['clean', 'malicious'].includes(result.status),
  )

  // A confirmed match from a trusted feed overrides the heuristic score.
  const finalScore = threatMatched ? 100 : score
  const { level, label } = classify(finalScore)

  const notes = []
  if (threatMatched) {
    notes.push('At least one threat intelligence provider lists this URL as malicious.')
  } else if (checkedProviders.length === 0) {
    notes.push(
      'No threat intelligence provider was available, so this result is based on heuristics only.',
    )
  }
  if (level === 'low') {
    notes.push('A low score does not guarantee that this website is safe.')
  }

  return {
    id: randomUUID(),
    submittedUrl: url.raw,
    normalizedUrl: url.href,
    scannedAt: new Date().toISOString(),
    score: finalScore,
    heuristicScore: score,
    level,
    label,
    verified: false, // PhishGuard never labels a URL as verified safe
    basis: threatMatched
      ? 'threat_intelligence'
      : checkedProviders.length > 0
        ? 'heuristics_and_threat_intelligence'
        : 'heuristics_only',
    indicators,
    threatIntelligence: providerResults,
    structure: {
      protocol: url.protocol,
      hostname: url.hostname,
      registrableDomain: url.isIp ? null : parts.registrable,
      subdomains: parts.subdomains,
      port: url.port || null,
      path: url.pathname,
      length: url.length,
      isIpAddress: url.isIp,
    },
    recommendations: recommendationsFor(level, threatMatched),
    notes,
  }
}
