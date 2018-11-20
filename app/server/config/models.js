"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var scraper = __importStar(require("../lib/declaration"));
var StockList = /** @class */ (function () {
    function StockList(stockList) {
        this.stockList = stockList;
        this.stockObjects = [];
    }
    StockList.prototype.getStockValues = function () {
        ;
        scraper.getStocks(this.stockList);
    };
    return StockList;
}());
exports.StockList = StockList;
