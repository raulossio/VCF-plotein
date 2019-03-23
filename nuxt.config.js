module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Plotein',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Protein visualization' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/Plotein.png?v2' },
      { rel: 'stylesheet', href: 'https://rawgithub.com/Caged/d3-tip/master/examples/example-styles.css' }
    ]
  },
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    { src: '~/assets/scss/main.scss', lang: 'scss'}
  ],
  fonts: ['~/fonts/*'],
  modules: [
    [ 'bootstrap-vue/nuxt', { css: false } ]
  ],
  plugins: [
    { src: '~/plugins/vue-fullscreen', ssr: false },
    { src: '~/plugins/notifications.js', ssr: false },
    { src: '~/plugins/tours.js' },
    { src: '~/plugins/global.js' },
    { src: '~/plugins/eventBus.js' },
  ],
  loading: { color: '#fff' },
  env: {
    URL_API: process.env.URL_API
  },
  router: {
    mode: 'hash',
  },
  build: {
    // vendor: ['vue-fullscreen'],
    extend (config, { isDev, isClient }) {
      config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'UglifyJsPlugin')
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  }
}

