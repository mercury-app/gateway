const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const compress = require("koa-compress");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");

const errorHandler = require("./middleware/error.middleware");
const applyApiMiddleware = require("./api");

const server = new Koa();

// Pass middlewares to our server instance
server
  .use(errorHandler)
  .use(helmet())
  .use(compress())
  .use(cors())
  .use(bodyParser());

// Add our API router to the server
applyApiMiddleware(server);

server.listen(3000);
