const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

module.exports = (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  // 监听目标服务的响应事件
  proxy.on('proxyRes', (proxyRes) => {
    // 将目标服务的响应流返回给客户端的响应流
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
