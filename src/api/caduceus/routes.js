const controller = require("./controller");

module.exports = Router => {
  const router = new Router({
    prefix: "/caduceus"
  });

  router
    .post("/", controller.getResponse);

  return router;
};
