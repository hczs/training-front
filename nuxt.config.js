module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '职工业务培训网站',
    script: [
      { src: 'https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Global CSS
  */
  css: [
    { src: 'element-ui/lib/theme-chalk/index.css' }, // 配置 element-ui 的 css 位置
    { src: 'swiper/dist/css/swiper.css' },
    { src: 'quill/dist/quill.snow.css' },
    { src: 'quill/dist/quill.bubble.css' },
    { src: 'quill/dist/quill.core.css' }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/element-ui', ssr: true }, // 配置element-ui的plugin，注意名字要和plugin下的文件对应
    { src: '~/plugins/swiper', ssr: false }, // 配置swiper的plugin，注意名字要和plugin下的文件对应
    { src: '~/plugins/routeguard', ssr: true }, // 配置路由守卫
    { src: '~/plugins/vue-quill-editor', ssr: false }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['element-ui'] // 3.此处配置 build 时带着element-ui
  }
}

