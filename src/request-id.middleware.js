const shortid = require('shortid')
const MDC = require('./mapped-diagnostic-context')

function requestIdMiddleware(req, res, next) {
  MDC.createContext(() => {
    MDC.put('requestId', shortid.generate())
    next()
  })
}

module.exports = requestIdMiddleware