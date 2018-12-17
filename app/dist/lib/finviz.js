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
    static getStockDataFromFinviz(ticker) {
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
            StockList.getStockDataFromFinviz(ticker);
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
const setResponseHeader = res => res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json',
});
function getStockList(req, res, next) {
    setResponseHeader(res);
    database_1.Database.getStockList(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getStockList = getStockList;
function getStock(req, res, next) {
    setResponseHeader(res);
    database_1.Database.getStock(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getStock = getStock;
function getUser(req, res, next) {
    setResponseHeader(res);
    database_1.Database.getUser(req.params.id).then(data => {
        res.json(data);
    }, err => next(err));
}
exports.getUser = getUser;
function webhook(req, res, next) {
    const { data, email } = req.params;
    res.send('Okay redirecting');
    res.redirect(`/api/webhook/${data}/${email}`);
}
exports.webhook = webhook;
function postStockList(req, res, next) {
    setResponseHeader(res);
    const { tickerList, name, email } = req.body;
    const stockList = new StockList();
    function setStockData() {
        let retries = 2;
        let count = 0;
        function retryIfNeeded() {
            tickerList.forEach((ticker) => {
                StockList.getStockDataFromFinviz(ticker).then(stock => {
                    stockList.pushToStockList(stock);
                    count++;
                    if (count === tickerList.length - 1 || tickerList.length === 1) {
                        // Retrieved all stock data
                        database_1.Database.saveStock(stockList, email, name);
                        // should send a request to an internal webhook when completed
                    }
                }, err => {
                    // if err call finviz up to 3 times to get stock data
                    if (!retries)
                        return next(`THERE WAS AN ERROR COLLECTING ALL STOCK DATA, HERE IS YOUR UPLOADED STOCKS\n ${stockList.getStockList()}`);
                    else {
                        retries--;
                        retryIfNeeded();
                    }
                });
            });
        }
        retryIfNeeded();
    }
    res.status(202).send('Stocks were accected and are now processing.');
    setStockData();
}
exports.postStockList = postStockList;
//# sourceMappingURL=finviz.js.map