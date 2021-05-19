/* eslint-disable no-console */
const axios = require("axios");

exports.getResponse = ctx => {
  console.log("getting response");
  console.log(ctx.request.body);
  const method = ctx.request.body["request"]["method"];
  const endpoint = ctx.request.body["request"]["endpoint"];
  const payload = ctx.request.body["request"]["payload"];

  console.log(payload);

  return axios({
    baseURL: "http://localhost:8888",
    method: method,
    url: endpoint,
    data: payload
  })
    .then(function(response) {
      console.log(response["data"]);
      ctx.status = 200;
      ctx.body = response["data"];
      return response;
    })
    .catch(function(error) {
      console.log(error);
    });
};
