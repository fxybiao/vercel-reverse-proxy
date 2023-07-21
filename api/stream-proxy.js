const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

module.exports = (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  // 用于保存目标服务的响应数据
  let responseData = '';
  let postData = '';
  // 监听目标服务的响应事件
  proxy.on('proxyRes', (proxyRes) => {
      req.on('data', chunk => {
      postData += chunk;
    });
    // 当目标服务的响应到达时，将数据保存到 responseData 变量中
    proxyRes.on('data', (chunk) => {
      responseData += chunk;
    });

    // 在响应结束后，将 responseData 返回给客户端
    proxyRes.on('end', () => {
	   console.log('POST 请求参数:', postData);
	   console.log('POST 请求结果:', responseData);
      // 设置客户端的响应头部
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      // 返回响应数据给客户端
      res.end(responseData);
    });
  });

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
