const { v4: uuidv4 } = require('uuid')
const axios = require('axios')

const SENTRY_ENDPOINT_STORE = 'store'
const SENTRY_AUTH_HEADER = 'X-Sentry-Auth'
const USER_AGENT = 'amio-sentry-client/1.0'

class SentryClient {

  init(sentryOptions) {
    this.config = parseDSN(sentryOptions.dsn)
    this.httpClient = axios.create({
      baseURL: this.config.url,
      headers: {
        'User-Agent': USER_AGENT
      }
    })

    this.sentryAuthTemplate = 'Sentry sentry_version=7,' +
    `sentry_client=${USER_AGENT},` +
    `sentry_timestamp=<timestamp>,` +
    `sentry_key=${this.config.publicKey}`

    if(this.config.secretKey) {
      this.sentryAuthTemplate = this.sentryAuthTemplate + `,sentry_secret=${this.config.secretKey}`
    }
  }

  async captureEvent(eventData) {
    const date = new Date()
    const event = Object.assign({
        event_id: generateEventId(),
        timestamp: date.toISOString(),
        platform: 'node'
      },
      eventData)

    try{
      await this.httpClient.post(`/api/${this.config.projectId}/${SENTRY_ENDPOINT_STORE}/`,
        event,
        {
          headers: {
            [SENTRY_AUTH_HEADER]: this.sentryAuthTemplate.replace('<timestamp>', date.valueOf())
          }
        })
    } catch(e) {
      console.error('sentry returned error:', e)
    }

  }
}

function generateEventId() {
  return uuidv4().split('-').join('')
}

function parseDSN(dsn) {
  const dsnParts = {}
  let skipSecret = false
  let cursor = 0
  let nextCursor = dsn.indexOf(':')
  const protocol = dsn.substring(cursor, nextCursor)
  cursor = nextCursor

  nextCursor = dsn.indexOf(':', cursor + 1)
  if(nextCursor === -1) { //secret key is optional so it doesn't have to be there
    skipSecret = true
    nextCursor = dsn.indexOf('@', cursor + 1)
  }
  dsnParts.publicKey = dsn.substring(cursor + 3, nextCursor)
  cursor = nextCursor

  if(!skipSecret) {
    nextCursor = dsn.indexOf('@', cursor + 1)
    dsnParts.secretKey = dsn.substring(cursor + 1, nextCursor)
    cursor = nextCursor
  }

  nextCursor = dsn.indexOf('/', cursor + 1)
  dsnParts.url = protocol + '://' + dsn.substring(cursor + 1, nextCursor)

  dsnParts.projectId = dsn.substring(nextCursor + 1)

  return dsnParts
}

module.exports = new SentryClient()
