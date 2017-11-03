# logzio-node-debug
A nodejs [debug wrapper](https://github.com/visionmedia/debug) for logz.io

This library is ES6 thus suitable for Node development and **not** for browser.

## Installation

```
npm install logzio-node-debug --save
``` 

### Sample usage

Initialize the lib with [Logz.io options](https://github.com/logzio/logzio-nodejs#options). Internally,
there are 2 loggers, `debug` and `error`

```
const logzOptions = { // Params doc: https://github.com/logzio/logzio-nodejs#options
  token: `${logzio_token}`, 
  type: `${the_app_you_wanna_track}`     
}

// you can add extra fields
const logzOptionsDebug = merge(logzOptions, { extraFields: { loglevel: 'debug' }} )
const logzOptionsError = merge(logzOptions, { extraFields: { loglevel: 'error' }} )

```

Create loggers, providing a namespace, for every file where you want to use logging (just like u're used to with [debug](https://github.com/visionmedia/debug)): 

```
const debug = require('logzio-node-debug').debug('your-project:server')
const error = require('logzio-node-debug').debug('your-project:server:error')

debug('I am debug')
error('I am error')
```

### Finished

Enjoy the colorful console logs and logz.io side by side. 
