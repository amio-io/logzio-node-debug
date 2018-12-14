const shortid = require('shortid')
const MDC = require('./request-scope-storage')

function requestIdMiddleware(req, res, next) {
  MDC.createContext(() => {
    MDC.put('requestId', shortid.generate())
    next()
  })
}

module.exports = requestIdMiddleware