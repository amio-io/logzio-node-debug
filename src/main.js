const debug = require('debug')
const logzIo = require('logzio-nodejs')

class LogzDebug {

    constructor() {
        this.logzLogger = null
    }

    init(logzOptions) {
        this.logzLogger = logzIo.createLogger(logzOptions)
    }

    debug(namespace) {
        if (!this.logzLogger) throw new Error('LogzDebug must be initialized first! require("logzio-debug").init(...)')
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
