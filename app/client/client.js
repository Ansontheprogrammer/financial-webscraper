"use strict";
exports.__esModule = true;
var request = require("request");
var host = "https://461ce3d5.ngrok.io/api/postStockList/";
// const hostHome = "http://localhost:3000/";
var options = {
    json: true
};
var response;
request.post(host, { form: { stockList: ['NYMT', 'GPX'] } }, function (req, res) {
    console.log(res);
});
