const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http:/82.65.224.151:50190',
      changeOrigin: true,
    })
  );
};
