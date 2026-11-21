// Unknown route handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  })
}

// Central error handler. Never leaks stack traces or internals to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'INVALID_JSON',
      message: 'The request body is not valid JSON.',
    })
  }

  // Body too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'PAYLOAD_TOO_LARGE',
      message: 'The request body is too large.',
    })
  }

  // CORS rejection
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS_FORBIDDEN',
      message: 'This origin is not allowed to access the API.',
    })
  }

  console.error('[server error]', err.message)
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong on the server. Please try again.',
  })
}