'use strict';

const controller = require('./controller');

module.exports = Router => {
  const router = new Router({
    prefix: `/caduceus`,
  });

  router
    // .get('/:userId', controller.getOne)
    // .get('/', controller.getAll)
    .post('/', controller.getResponse);

  return router;
};
