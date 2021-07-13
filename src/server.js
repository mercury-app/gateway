const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const compress = require("koa-compress");
const cors = require("@koa/cors");
const helmet = require("koa-helmet");
const proxy = require("koa-proxies");
const websockify = require('koa-websocket');
const Router = require('koa-router');
var WebSocketClient = require('websocket').client;

const errorHandler = require("./middleware/error.middleware");

const apiVersion = "v1";
const serviceProxyUrls = {
  orchestration: "http://localhost:8888",
  workspace: "http://localhost:4000"
};
const serviceWsUrls = {
  orchestration: "ws://localhost:8888"
};

const servicePath = serviceName => `/${apiVersion}/${serviceName}`;
const serviceProxy = serviceName => {
  return proxy(servicePath(serviceName), {
    target: serviceProxyUrls[serviceName],
    rewrite: path => path.replace(servicePath(serviceName), ""),
    changeOrigin: true,
    logs: true
  });
};

// for adding websockets to koa instance
const server = websockify(new Koa());

var openSockets = {};
const router = new Router();
router.all(`/${apiVersion}/orchestration/nodes/:id/ws`, (ctx, ) => {
  const socketAddr = `${serviceWsUrls["orchestration"]}/nodes/${ctx.params.id}/ws`

  console.log(`attempting socket opening for ${socketAddr}`);
  if (!(socketAddr in openSockets)) {
    console.log('creating')
    openSockets[socketAddr] = new WebSocketClient();

    openSockets[socketAddr].on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString());
    });

    openSockets[socketAddr].on('connect', (connection) => {
      console.log("socket opened to orchestration")

      connection.on('message', (message) => {
        console.log(`message received from server`);
        console.log(`sending message to client`);
        ctx.websocket.send(message.utf8Data);
      });

      connection.on('close', () => {
        console.log(`connection to ${socketAddr} closed`);
        delete openSockets[socketAddr];
      })

    });

    openSockets[socketAddr].connect(socketAddr);
  }
});

server.ws.use(router.routes());

server
  .use(errorHandler)
  .use(helmet())
  .use(compress())
  .use(cors())
  .use(serviceProxy("orchestration"))
  .use(serviceProxy("workspace"))
  .use(bodyParser());

server.listen(3000);
