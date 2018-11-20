"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var models = __importStar(require("../config/models"));
function sendMessages(message, res) {
    console.log(message);
    res.send(message);
}
function getStockListHandler(req, res) {
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    });
    res.status(200);
    res.set('content/type', 'application/json');
    sendMessages("===Connection made, redirecting to JSON server", res);
    res.redirect(302, 'http://localhost:3004/posts');
}
exports.getStockListHandler = getStockListHandler;
function postStockListHandler(req, res) {
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    });
    res.status(200);
    sendMessages("===Calling finviz", res);
    var stockList = new models.StockList(req.body.stockList);
    res.send(stockList.getStockValues());
}
exports.postStockListHandler = postStockListHandler;
