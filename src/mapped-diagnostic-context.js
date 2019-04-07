const continuationStorage = require('cls-hooked')

const createNamespace = continuationStorage.createNamespace
const getNamespace = continuationStorage.getNamespace

const NSP_REQUEST = 'logzio-node-debug-request'
const KEY_MDC = 'mdc'
const requestNamespace = createNamespace(NSP_REQUEST)

/**
 * Create MDC context. Has to be called before calling `put`, otherwise `put` will have no effect.
 * 
 * It is possible to create nested contexts. In that case, all MDC data from parent context will be copied
 * to child context, therefore all modifications to MDC in the child context will be done independently from 
 * the parent context.
 * 
 * @param {function} next Context callback. MDC data will be valid during the whole duration of the callback. This makes it ideal to call this in a middleware function.
 */
function createContext(next) {
  const mdc = getAll()
  const mdcCopy = Object.assign({}, mdc)
  requestNamespace.run(() => {
    requestNamespace.set(KEY_MDC, mdcCopy)
    next()
  })
}

function getAll() {
  const mdc = getNamespace(NSP_REQUEST).get(KEY_MDC)

  return mdc || {}
}

function get(key) {
  const mdc = getAll()
  return mdc[key]
}

function put(key, value) {
  const mdc = getAll()
  mdc[key] = value
}

function remove(key) {
  put(key, undefined)
}

function clear() {
  requestNamespace.set(KEY_MDC, {})
}


module.exports = {
  createContext,
  getAll,
  get,
  put,
  remove,
  clear
}