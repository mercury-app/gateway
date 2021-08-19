const spawn = require("child_process").spawn;
const spawnSync = require("child_process").spawnSync
const fs = require("fs")
const config = require("config");

const orchestrationConfig = config.get('orchestration');
const workspaceConfig = config.get("workspace")
const currentTimestamp = new Date().toISOString();
const orchestrationDir = orchestrationConfig.dir;
const workspaceDir = workspaceConfig.dir;

if (orchestrationDir.length == 0)
  throw "orchestation directory needs to be specified"

if (workspaceDir.length == 0)
  throw "workspace directory needs to be specified"

// stop running orchestration and workspace processes to free up ports
const ports = [orchestrationConfig.port, workspaceConfig.port]

ports.forEach(function (port) {
  const processPid = spawnSync('lsof', ['-t', `-i:${port}`], { encoding: 'utf8' })
  if (Number.isInteger(parseInt(processPid.stdout))) {
    console.log(`Killing process ${parseInt(processPid.stdout)}`)
    process.kill(parseInt(processPid.stdout))
  }
})

// start orchestration
console.log("Starting orchestration...")
const orchestrationLogStream = fs.createWriteStream(`orchestration.log`, { flags: 'a' });
const orchestrationProcess = spawn("poetry", ["run", "python3", "-m", "server.app"], {
  cwd: orchestrationDir,
  detached: true
})

orchestrationProcess.stdout.pipe(orchestrationLogStream)
orchestrationProcess.stderr.pipe(orchestrationLogStream)

orchestrationProcess.on('close', function (code) {
  console.log('orchestration exited with code ' + code);
});

console.log("Started orchestration")


// start workspace
console.log("Starting workspace...")
const workspaceLogStream = fs.createWriteStream(`workspace.log`, { flags: 'a' });
const workspaceProcess = spawn("npm", ["run", "dev"], {
  cwd: workspaceDir,
  detached: true
})

workspaceProcess.stdout.pipe(workspaceLogStream)
workspaceProcess.stderr.pipe(workspaceLogStream)

workspaceProcess.on('close', function (code) {
  console.log('workspace exited with code ' + code);
});
console.log("Started workspace")


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
router.all(`/${apiVersion}/orchestration/workflows/:workflowId/nodes/:nodeId/ws`, (ctx,) => {
  const socketAddr = `${serviceWsUrls["orchestration"]}/workflows/${ctx.params.workflowId}/nodes/${ctx.params.nodeId}/ws`

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
