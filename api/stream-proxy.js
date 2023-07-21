// api/stream-proxy.js
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

module.exports = (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com/speech-api/v2/recognize'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
