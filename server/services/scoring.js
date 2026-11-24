// Risk bands requested for the project:
//   0-29 Low Risk, 30-69 Suspicious, 70-100 High Risk
export function classify(score) {
  if (score >= 70) return { level: 'high', label: 'High Risk' }
  if (score >= 30) return { level: 'suspicious', label: 'Suspicious' }
  return { level: 'low', label: 'Low Risk' }
}

// Adds up indicator points, capped at 100.
export function heuristicScore(indicators) {
  const total = indicators.reduce((sum, item) => sum + item.points, 0)
  return Math.min(100, total)
}

export function recommendationsFor(level, threatMatched) {
  if (threatMatched) {
    return [
      'Do not open this link or enter any information.',
      'If you already visited it, change the passwords of any account you used and enable two-factor authentication.',
      'Report the link to your IT team or the impersonated organisation.',
    ]
  }
  if (level === 'high') {
    return [
      'Do not click the link or enter any personal details.',
      'If the message claims to be from a company, go to its official website by typing the address yourself.',
      'Report the message as phishing to your email provider.',
    ]
  }
  if (level === 'suspicious') {
    return [
      'Be cautious. Do not enter passwords or payment details unless you are certain of the site.',
      'Confirm the sender through another channel, such as an official phone number.',
      'Type the official website address manually instead of using this link.',
    ]
  }
  return [
    'No strong phishing indicators were found in the address itself.',
    'This is not a guarantee of safety. Be careful with unexpected messages and never share passwords by following links.',
  ]
}
