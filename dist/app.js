"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const finviz = __importStar(require("./lib/finviz"));
const express = require('express');
exports.app = express();
const port = process.env.PORT || 80;
const bodyParser = require('body-parser');
exports.app.use(bodyParser.json()); // to support JSON-encoded bodies
exports.app.use(bodyParser.urlencoded({
    extended: true
}));
exports.app.use(express.json()); // to support JSON-encoded bodies
exports.app.get('/', (req, res, next) => {
    res.send('Inside test root route');
});
exports.app.get('/api/getStockList/:id', finviz.getStockList);
exports.app.post('/api/postStockList', finviz.postStockList);
exports.app.post('/api/compoundInterest', () => { });
exports.app.listen(port, () => console.log('Server is listening on port ' + port));
//# sourceMappingURL=app.js.map