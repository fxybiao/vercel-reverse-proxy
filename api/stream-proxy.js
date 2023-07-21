const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

module.exports = (req, res) => {
  // 目标服务的 URL
   const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  // 在 proxyReq 事件中拦截请求，并修改请求参数
  proxy.on('proxyReq', (proxyReq, req, res, options) => {
    // 获取 POST 请求的数据
    let postData = '';
    req.on('data', chunk => {
      postData += chunk;
    });

    req.on('end', () => {
      // 在请求结束后，打印 POST 请求的参数
      console.log('POST 请求参数:', postData);

      // 在这里你可以对 postData 进行修改，根据业务逻辑进行相应的操作
      // 例如，添加额外的参数或修改现有的参数
      // ...

      // 将修改后的数据写入代理请求的缓冲区
      //proxyReq.write(postData);

      // 继续发送代理请求
      //proxyReq.end();
    });
  });

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
