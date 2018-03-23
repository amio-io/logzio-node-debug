const debug = require('debug')
const logzIo = require('logzio-nodejs')
const stringifyObject = require('stringify-object')

class LogzDebug {

  constructor() {
    this.logzLogger = {
      log() {
        // do nothing if logzio not initialized. Useful for tests.
      }
    }
  }

  init(logzOptions) {
    this.logzLogger = logzIo.createLogger(logzOptions)
  }

  debug(namespace) {
    const logLevel = namespace.endsWith(':error') ? 'error' : 'debug'
    const debugLogger = debug(namespace)

    return (...args) => {
      // const loggedMethodName = logger.caller ? logger.caller.name : 'UNKNOWN'
      debugLogger(...args)

      const stringifiedArgs = args.map(arg => {
        const coercedArg = debug.coerce(arg)
        if (typeof coercedArg === 'string') return coercedArg

        return stringifyObject(coercedArg)
          .replace(/\s+/g, ' ')
      })

      this.logzLogger.log({
        level: logLevel,
        message: [namespace, ...stringifiedArgs]
      })
    }
  }
}

module.exports = new LogzDebug()
