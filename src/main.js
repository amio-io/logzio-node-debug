const debug = require('debug')
const logzIo = require('logzio-nodejs')

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

            this.logzLogger.log({
                level: logLevel,
                message: [namespace, ...args].join(' ')
            })
        }
    }
}

module.exports = new LogzDebug()
