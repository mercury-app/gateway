'use strict';

const axios = require('axios');
// const generateId = require('../../utils/generateId.util');

/**
 * Mock database, replace this with your db models import, required to perform query to your database.
 */
// const db = {
//   users: [
//     {
//       id: 'bff28903-042e-47c2-b9ee-07c3954989ec',
//       name: 'Marco',
//       created_at: 1558536830937,
//     },
//     {
//       id: 'dca01a32-36e6-4886-af75-8e7caa0162a9',
//       name: 'Leonardo',
//       created_at: 1558536843742,
//     },
//     {
//       id: 'dca01a32-36e6-4886-af75-8e7caa0162a9',
//       name: 'Berta',
//       created_at: 1558536863550,
//     },
//   ],
// };

exports.getResponse = ctx => {
  console.log('getting response');
  console.log(ctx.request.body);
  const method = ctx.request.body['request']['method'];
  const endpoint = ctx.request.body['request']['endpoint'];
  const payload = ctx.request.body['request']['payload'];

  console.log(payload);

  return axios({
    baseURL: 'http://localhost:8888',
    method: method,
    url: endpoint,
    data: payload,
  })
    .then(function(response) {
      console.log(response["data"]);
      ctx.status = 200;
      ctx.body = response["data"];
    })
    .then(function(error) {
      console.log(error);
    });
};
