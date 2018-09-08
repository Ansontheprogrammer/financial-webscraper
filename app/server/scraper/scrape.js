"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var finviz = require('finviz');
var fs = require('fs');
var request = require('request');
// let stocks = "OPHT FWP TYHT CERC AMS AEZS".split(' ')
function createFile(stockList) {
    // Wait for list to be made	
    stockList.forEach(function (stock) {
        var string = JSON.stringify(stock);
        fs.appendFile('Stocks-HealthCare.json', string, function (err) {
            if (err)
                throw err;
            console.log('The file has been saved!\n', string);
        });
    });
}
exports.createFile = createFile;
function addToJsonServer(stockList) {
    // Wait for list to be made	
    stockList.forEach(function (stock) {
        var string = JSON.stringify(stock);
        var jsonServer = 'http://localhost:3004/posts';
        request.post(jsonServer, { form: { healthCare: stock } }, function (req, res) {
            console.log(string, 'Was sent');
        });
    });
}
exports.addToJsonServer = addToJsonServer;
function deleteFromJsonServer(stockList) {
}
exports.deleteFromJsonServer = deleteFromJsonServer;
function filterStockProps(data, ticker) {
    var stockData = {
        ticker: ticker,
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
    return stockData;
}
exports.filterStockProps = filterStockProps;
function getStocks(stocks) {
    var stockDataList = [];
    function iterateStocks() {
        stocks.forEach(function (stock) { return finvizCall(stock, createFile, filterStockProps); });
    }
    function finvizCall(ticker, createFileFunction, filterStockPropsFunction) {
        if (ticker !== '') {
            finviz.getStockData(ticker)
                .then(function (data) {
                return filterStockPropsFunction(data, ticker);
            })
                .then(function (data) {
                stockDataList.push(data);
                if (stockDataList.length > 1) {
                    addToJsonServer(stockDataList);
                }
            })
                .catch(function (err) { return console.error(err.stack ? err.stack : err); });
        }
    }
    function calls() {
        iterateStocks();
        function create() {
            if (stockDataList.length > 0) {
                return stockDataList;
            }
            setTimeout(create, 3000);
        }
        return create();
    }
    return calls();
}
exports.getStocks = getStocks;
