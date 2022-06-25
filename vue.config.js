module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    open: true,
    proxy: {
      '/admin': {
        target: 'http://elm.cangdu.org',
        changeOrigin: true,
      },
      '/shopping': {
        target: 'http://elm.cangdu.org',
        changeOrigin: true,
      },
    },
  },
}
