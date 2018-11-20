"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = __importStar(require("./lib/router"));
var port = process.env.PORT || 80;
exports.app = express();
var bodyParser = require('body-parser');
exports.app.use(bodyParser.json()); // to support JSON-encoded bodies
exports.app.use(bodyParser.urlencoded({
    extended: true
}));
exports.app.use(express.json()); // to support JSON-encoded bodies
exports.app.get('/api/stockList', router.getStockListHandler);
exports.app.post('/api/stockList', router.postStockListHandler);
exports.app.listen(port, function () {
    console.log('Server is listening on port ' + port);
});
