"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var finviz = require('finviz');
var fs = require('fs');
var request = require('request');
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
        stock = JSON.stringify(stock);
        var jsonServer = 'http://localhost:3004/posts';
        request.post(jsonServer, { form: { stockList: stock } }, function (req, res) {
            console.log(stock, '===Request sent to json server');
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
        return stocks.forEach(function (stock) {
            return finvizCall(stock, createFile, filterStockProps);
        });
    }
    function finvizCall(ticker, createFileFunction, filterStockPropsFunction) {
        if (ticker !== '') {
            finviz.getStockData(ticker)
                .then(function (data) {
                return filterStockPropsFunction(data, ticker);
            })
                .then(function (data) {
                stockDataList.push(data);
                console.log("===Received data from finviz", stockDataList);
                if (stockDataList.length >= 1) {
                    return stockDataList;
                }
                else {
                    console.error("Data was not saved.", stockDataList);
                }
            })
                .then(function (data) { return addToJsonServer(data); })
                .catch(function (err) { return console.error(err); });
        }
    }
    return iterateStocks();
}
exports.getStocks = getStocks;
