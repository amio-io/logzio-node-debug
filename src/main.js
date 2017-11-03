const debug = require('debug')
const logzIo = require('logzio-nodejs')

class LogzDebug {

    constructor () {
        this.logzDebug = null
        this.logzError = null
    }

    init(logzOptionsDebug, logzOptionsError){
        this.logzDebug = logzIo.createLogger(logzOptionsDebug)

        this.logzError = logzIo.createLogger(logzOptionsError)
    }

    debug(namespace){
        if(!this.logzDebug) throw new Error('logz-node-debug must be initialized first! require("logzio-debug").init(...)')

        return (...args) => {
            // const loggedMethodName = logger.caller ? logger.caller.name : 'UNKNOWN'
            debug(namespace)(...args)

            const logz = namespace.endsWith(':error') ? this.logzError : this.logzDebug
            logz.log([namespace, ...args].join(' '))
        }
    }
}

module.exports = new LogzDebug()
