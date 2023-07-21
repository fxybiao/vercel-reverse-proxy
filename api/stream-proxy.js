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
   proxy.on('proxyRes', function (proxyRes, req, res) {
    var body = [];
    proxyRes.on('data', function (chunk) {
        body.push(chunk);
    });
    proxyRes.on('end', function () {
        body = Buffer.concat(body).toString();
        console.log("res from proxied server:", body);
        res.end("my response to cli");
    });
});
  });

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
