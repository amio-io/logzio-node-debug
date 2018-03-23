const continuationStorage = require('continuation-local-storage');
const createNamespace = continuationStorage.createNamespace
const requestNamespace = createNamespace('request');
const shortid = require('shortid');

function requestIdMiddleware(req, res, next) {
  requestNamespace.run(() => {
    requestNamespace.set('id', shortid.generate())
    next()
  })
}

module.exports = requestIdMiddleware