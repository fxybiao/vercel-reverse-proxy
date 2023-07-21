const express = require('express');
const httpProxy = require('http-proxy');
const { pipeline } = require('stream');

const app = express();
const proxy = httpProxy.createProxyServer();

app.all('/speech-api/v2/recognize', (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  // 将请求转发到目标服务
  proxy.web(req, res, { target: targetUrl, selfHandleResponse: true });
  
  // 监听目标服务的响应事件
  proxy.on('proxyRes', (proxyRes) => {
    // 设置客户端的响应头部
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // 使用 stream.pipeline() 将目标服务的响应数据传输给客户端
    pipeline(proxyRes, res, (err) => {
      if (err) {
        console.error('Pipeline Error:', err);
        res.end(); // 确保响应终止
      }
    });
  });
});

// 在 Vercel 上使用 Express.js 处理自定义 API
module.exports = app;
