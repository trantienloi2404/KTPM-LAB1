const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
    })
  );
  
  app.use(
    '/api/todos',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
    })
  );

  app.use(
    '/api/notes',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
    })
  );

  app.use(
    '/api/notifications',
    createProxyMiddleware({
      target: 'http://localhost:8083',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' }
    })
  );

  app.use(
    '/api/images',
    createProxyMiddleware({
      target: 'http://localhost:8084',
      changeOrigin: true,
      // Add these options for file uploads
      onProxyReq: (proxyReq, req, res) => {
        // For multipart forms, don't touch the body
        if (req.method === 'POST' && req.headers['content-type'] && 
            req.headers['content-type'].startsWith('multipart/form-data')) {
          return;
        }
      },
      logLevel: 'debug' // This helps with debugging
    })
  );
};