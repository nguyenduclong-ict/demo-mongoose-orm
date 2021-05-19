const { Nuxt, Builder } = require('nuxt')

// We instantiate Nuxt.js with the options
const config = require('../nuxt.config.js/index.js.js.js.js.js.js.js.js.js')
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  new Builder(nuxt).build()
}
