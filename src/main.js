const debug = require('debug')
const logzIo = require('logzio-nodejs')
const stringifyObject = require('stringify-object')
const requestScopeStorage = require('./mapped-diagnostic-context')
const requestIdMiddleware = require('./request-id.middleware')
const Sentry = require('@sentry/node')

class LogzDebug {

  constructor() {
    this.MDC = requestScopeStorage
    this.logzLogger = {
      log() {
        // do nothing if logzio not initialized. Useful for tests.
      }
    }
  }

  init(logzOptions, sentryOptions) {
    if(logzOptions) {
      this.logzLogger = logzIo.createLogger(logzOptions)
      this.logzEnabled = true
    }

    if(sentryOptions) {
      Sentry.init(sentryOptions)
      this.sentryEnabled = true
    }
  }

  requestIdMiddleware(req, res, next) {
    requestIdMiddleware(req, res, next)
  }

  debug(namespace) {
    const logLevel = namespace.endsWith(':error') ? 'error' : 'debug'
    const debugLogger = debug(namespace)

    return (...args) => {
      const mdc = requestScopeStorage.getAll()

      // const loggedMethodName = logger.caller ? logger.caller.name : 'UNKNOWN'
      debugLogger(...args)

      const stringifiedArgs = args.map(arg => {
        const coercedArg = debug.coerce(arg)
        if (typeof coercedArg === 'string') return coercedArg

        return stringifyObject(coercedArg)
          .replace(/\s+/g, ' ')
      })

      if(this.logzEnabled) {
        const logData = Object.assign({
            level: logLevel,
            message: [namespace, ...stringifiedArgs]
          },
          mdc)

        this.logzLogger.log(logData)
      }

      if(this.sentryEnabled && logLevel === 'error') { 
        Sentry.captureEvent({
          message: stringifiedArgs,
          logger: this.namespace
        })
      }
    }
  }
}

module.exports = new LogzDebug()
