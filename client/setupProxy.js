
// à placer dans le 'src' directory du projet React

// Ce programme permet maintenant de :
// Use the proxy:Now, whenever you make a request from your React app to /api, it will be proxied to your backend server.


const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://82.65.224.151',
      changeOrigin: true,
    })
  );
};


