const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();


const services = [
  {
    route: "/api/user/getOrdersByUserId",
    target: `http://localhost:5007/api/user/getOrdersByUserId`,
  },
  // Add more services as needed either deployed or locally.
 ];

app.use('/api/user/getOrdersByUserId', (req, res) => {
  console.log(`Incoming request to /api/user/getOrdersByUserId: ${req.method} ${req.url} `);
  const targetUrl = services.find(service => service.route === req.baseUrl)?.target;

  proxy.web(req, res, { target: targetUrl }, (err) => {
  console.error(`Error forwarding request to service A: ${err.message} `);
  res.status(500).send('Internal Server Error'); 
 });
});
  
  // Add this middleware to log the request received by the proxy 
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  console.log(`Received request to ${options.target.href}: ${req.method} ${req.url} `);
});
  
const port = 9000;
  app.listen(port, () => {
  console.log(`API Gateway listening on port ${port} `);
});