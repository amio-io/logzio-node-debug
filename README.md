# logzio-node-debug
[![npm version](https://badge.fury.io/js/logzio-node-debug.svg)](https://badge.fury.io/js/logzio-node-debug)

A nodejs [debug wrapper](https://github.com/visionmedia/debug) for logz.io

This library is ES6 thus suitable for Node development and **not** for browser.

This lib quite opinionated in a way. In case somebody needs to change it. We can parametrized:
- all `namespace`s will be sent to Logz.io in the message
- log levels are `{level: debug}` or `{level: error}`

## Installation

```
npm install logzio-node-debug --save
``` 

### Sample usage

Initialize the lib with [Logz.io options](https://github.com/logzio/logzio-nodejs#options):

```
const logzOptions = { // Params doc: https://github.com/logzio/logzio-nodejs#options
  token: `${logzio_token}`, 
  type: `${the_app_you_wanna_track}`     
}

require('logzio-node-debug').init(logzOptions)
```

Create loggers, providing a namespace, for every file where you want to use logging (just like u're used to with [debug](https://github.com/visionmedia/debug)): 

```
const debug = require('logzio-node-debug').debug('your-project:server')
const error = require('logzio-node-debug').debug('your-project:server:error')

debug('I am debug')
error('I am error')
```

### MDC - Mapped Diagnostic Context
Inspired by [Logback's implementation](https://logback.qos.ch/manual/mdc.html) of [SLF4J MDC API](https://www.slf4j.org/manual.html#mdc)

MDC allows you to store extra data which will be automagically appended to every log entry as long as you stay in the current context. In Logz.io, the MDC keys will be shown as Fields and can be used as filter parameters.

### Compatiblity issue
We have moved to `cls-hooked` instead of `continuation-local-storage` so that the lib is compatible with async/await. 
This causes the MDC to work with NodeJS versions 8+. If any of you need MDC to work with lower versions, create a PR
with a switch to `cls-hooked` and `continuation-local-storage`. Thank you. ;)

#### MDC API
##### MDC.createContext(next)
Creates MDC context. Has to be called before calling `put`, otherwise `put` will have no effect.

It is possible to create nested contexts. In that case, all MDC data from parent context will be copied to child context, therefore all modifications to MDC in the child context will be done independently from the parent context.

The `next` parameter is context callback. MDC data will be valid during the whole duration of the callback. This makes it ideal to call this in a middleware function (see [request-id.middleware.js](src/request-id.middleware.js) for example).
```
const MDC = require('logzio-node-debug').MDC

MDC.createContext(doStuff)
```

Or, if you want to create a context with one or more values already initialized:

```
const MDC = require('logzio-node-debug').MDC

MDC.createContext(() => {
  MDC.put('foo', 'bar')
  doStuff()
})
```

Or, as an Express middleware function:

```
const MDC = require('logzio-node-debug').MDC

function mdcMiddleware(req, res, next) {
  MDC.createContext(() => {
    MDC.put('foo', 'bar')
    next()
  })
}
```

##### MDC.getAll()
Returns the whole MDC object.

##### MDC.get(key)
Returns the value of the `key` in MDC.

##### MDC.put(key, value)
Sets the `value` of `key` in MDC.

##### MDC.remove(key)
Sets the `key` to `undefined`.

##### MDC.clear()
Removes all data from MDC.

##### One example to explain them all
```
MDC.createContext(() => {
  MDC.put('foo', '1')
  doStuff()
})

function doStuff() {
  MDC.put('bar', 2)
  MDC.get('foo') // => '1'
  MDC.getAll() // => {foo: '1', bar: 2}
  MDC.remove('foo')
  MDC.getAll() // => {bar: 2}
  MDC.clear()
  MDC.getAll() // => {}
}
```

#### Request ids in logs
A common use-case for MDC is adding a `requestId` to all incoming requests. If you have some concurrent request (which you for sure have in prod ;-) then you can filter logs by `requestId`.
To enable this functionality, you can use pre-implemented `express` middleware `requestIdMiddleware`. Just add it to your app middlewares, probably somewhere in **app.js**:
```
const requestIdMiddleware = require('logzio-node-debug').requestIdMiddleware
app.use(requestIdMiddleware)
```

In Logz.io/Kibana use field `requestId` to filter your logs. 

### Tests

While testing you will probably need no Logz.io at all. In that case, just don't initialize the lib with 
`require('logzio-node-debug').init`.

### Log level

2 log levels will be appended to your message - {level: debug} or {level: error}.

### That's all folks

Enjoy the colorful console logs and logz.io side by side. 
