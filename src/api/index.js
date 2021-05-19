const KoaRouter = require("koa-router");

const apiVersion = "v1";

function applyApiMiddleware(app) {
  const router = new KoaRouter({
    // prefix adds a prefix before every route
    prefix: `/api/${apiVersion}`
  });

  // set caduceus service api
  const caduceusApi = require("./caduceus")(KoaRouter);

  // this attaches caduceus' routes to main routes
  router.use(caduceusApi.routes());

  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = applyApiMiddleware;
