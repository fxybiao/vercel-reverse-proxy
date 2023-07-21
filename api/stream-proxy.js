const http = require('http');
const https = require('https');

const express = require('express');
const { pipeline } = require('stream');

const app = express();

app.all('/speech-api/v2/recognize', (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 解析目标服务的主机名和路径
  const { hostname, pathname } = new URL(targetUrl);

  // 构造代理请求选项
  const proxyOptions = {
    hostname,
    path: pathname + req.url,
    method: req.method,
    headers: req.headers,
  };

  // 根据请求是 HTTP 还是 HTTPS，使用相应的模块发送代理请求
  const proxyClient = targetUrl.startsWith('https://') ? https : http;

  const proxyReq = proxyClient.request(proxyOptions, (proxyRes) => {
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

  // 将客户端的请求数据传输给代理请求
  req.pipe(proxyReq);

  // 监听代理请求的错误事件
  proxyReq.on('error', (err) => {
    console.error('Proxy Request Error:', err);
    res.sendStatus(500); // 返回错误状态码给客户端
  });

  // 结束代理请求
  proxyReq.end();
});

// 在 Vercel 上使用 Express.js 处理自定义 API
module.exports = app;
