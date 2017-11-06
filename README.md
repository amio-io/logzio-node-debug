# logzio-node-debug
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

### Tests

While testing you will probably need no Logz.io at all. In that case, just don't initialize the lib with 
`require('logzio-node-debug').init`.

### Log level

2 log levels will be appended to your message - {level: debug} or {level: error}.

### Finished

Enjoy the colorful console logs and logz.io side by side. 
