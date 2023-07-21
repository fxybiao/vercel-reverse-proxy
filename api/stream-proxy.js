const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

 const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

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

  // 将请求转发到目标服务
  proxy.web(req, res, { changeOrigin: true, target: targetUrl });
};
