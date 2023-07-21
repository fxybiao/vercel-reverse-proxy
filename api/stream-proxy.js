	const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

module.exports = (req, res) => {
  // 目标服务的 URL
  const targetUrl = 'https://www.google.com'; // 替换为目标服务的 URL

  // 设置请求头部
  req.headers['Host'] = new URL(targetUrl).host;

  proxy.on('proxyRes', function (proxyRes, req, res) {
                   // modifyResponse(res, proxyRes, function (response) {
                   //      console.log("----[proxyRes]---->", response)
                   //      // modify response eventually
                   //      return response; // return value can be a promise
                   //  });
	  
	  
    var body = [];
   proxyRes.on('data', function (chunk) {
        body.push(chunk);
    });
	  
    proxyRes.on('end', function () {
        body = Buffer.concat(body).toString();
        console.log("res from proxied server:", body);
        res.end(body);
	  
     });
	  
	  
});

  // 将请求转发到目标服务
  proxy.web(req, res, { selfHandleResponse : true, changeOrigin: true, target: targetUrl });
};
