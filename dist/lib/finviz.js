"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const finviz_1 = __importDefault(require("finviz"));
const database_1 = require("./database");
class StockList {
    constructor() {
        this.stockList = [];
    }
    getStockList() {
        return this.stockList;
    }
    shiftStockList() {
        this.stockList.shift();
    }
    pushToStockList(stock) {
        this.stockList.push(stock);
    }
    static getStocks(ticker) {
        return new Promise((resolve, reject) => {
            finviz_1.default.getStockData(ticker)
                .then((allStockData) => resolve(StockList.filterStockProps(allStockData, ticker)))
                .catch((err) => reject(err));
        });
    }
    static filterStockProps(data, ticker) {
        // during times of the market, data must be retrieved multiple times
        if (!data) {
            console.error('Data not retrieved, fetching again');
            StockList.getStocks(ticker);
        }
        else {
            console.log('Retrieved Data for: ', ticker);
        }
        return {
            ticker,
            dividendPercent: data['Dividend %'],
            ROE: data.ROE,
            ROA: data.ROA,
            ROI: data.ROI,
            EPSPast5Y: data['EPS past 5Y'],
            price: data.Price,
            grossMargin: data['Gross Margin'],
            profitMargin: data['Profit Margin'],
            operatingMargin: data['Oper. Margin'],
            marketCap: data['Market Cap']
        };
    }
}
exports.StockList = StockList;
function getStockList(req, res, next) {
    database_1.Database.getStockList(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getStockList = getStockList;
function getStock(req, res, next) {
    database_1.Database.getStock(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getStock = getStock;
function getUser(req, res, next) {
    database_1.Database.getUser(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getUser = getUser;
function postStockList(req, res, next) {
    const { tickerList, name, email } = req.body;
    const stockList = new StockList();
    const setData = setStockData();
    res.send("Retrieving stock data from finviz");
    setData();
    function setStockData() {
        let retries = 3;
        let count = 0;
        return function retryIfNeeded() {
            tickerList.forEach((ticker) => {
                StockList.getStocks(ticker).then(stock => {
                    stockList.pushToStockList(stock);
                    count++;
                    if (count === tickerList.length - 1 || tickerList.length === 1) {
                        res.send("Saving data to database");
                        res.setStatus(200);
                        // Retrieved all stock data
                        database_1.Database.saveStock(stockList, email, name);
                    }
                }, err => {
                    // if err call finviz up to 3 times to get stock data
                    if (!retries)
                        throw err;
                    retries--;
                    retryIfNeeded();
                });
            });
        };
    }
}
exports.postStockList = postStockList;
//# sourceMappingURL=finviz.js.map