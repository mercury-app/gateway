const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const compress = require("koa-compress");
const cors = require("@koa/cors");
const helmet = require("koa-helmet");
const proxy = require("koa-proxies");

const errorHandler = require("./middleware/error.middleware");

const apiVersion = "v1";
const serviceProxyUrls = {
  orchestration: "http://localhost:8888"
};

const servicePath = serviceName => `/${apiVersion}/${serviceName}`;
const serviceProxy = serviceName => {
  return proxy(servicePath("orchestration"), {
    target: serviceProxyUrls[serviceName],
    rewrite: path => path.replace(servicePath(serviceName), ""),
    changeOrigin: true,
    logs: true
  });
};

const server = new Koa();
server
  .use(errorHandler)
  .use(helmet())
  .use(compress())
  .use(cors())
  .use(serviceProxy("orchestration"))
  .use(bodyParser());

server.listen(3000);
