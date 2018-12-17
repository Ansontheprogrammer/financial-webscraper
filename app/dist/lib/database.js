"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const url = "mongodb+srv://AnsonErvin:dreamg1rl@cluster0-gs1k4.gcp.mongodb.net/test?retryWrites=true";
// connecting to mongo and creating schema
mongoose_1.default.connect(url);
const Schema = mongoose_1.default.Schema;
const stockSchema = {
    userID: String,
    ticker: String,
    dividendPercent: String,
    ROE: String,
    ROA: String,
    ROI: String,
    EPSPast5Y: String,
    price: String,
    grossMargin: String,
    profitMargin: String,
    operatingMargin: String,
    marketCap: String
};
const schemas = {
    stock: new Schema(stockSchema, { autoIndex: false }),
    stockList: new Schema({
        name: String,
        list: [],
        email: String,
    }, { autoIndex: false }),
    user: new Schema({
        stockListCollection: [{ name: String, stockListID: String }],
        email: String
    }, { autoIndex: false })
};
class Database {
    static saveUser(stockListInfo, email) {
        const { name, stockListID } = stockListInfo;
        const UserModel = mongoose_1.default.model('User', schemas.user);
        const user = new UserModel({
            stockListCollection: [{ name, stockListID }],
            email,
        });
        user.save(function (err, userID) {
            if (err)
                console.error(err);
            console.log('Saved new user of ID', userID._id);
        });
    }
    static saveStockList(stockList, email, name) {
        const StockListModel = mongoose_1.default.model('StockList', schemas.stockList);
        const list = new StockListModel(stockList);
        list.save(function (err, stockListID) {
            if (err)
                console.error(err);
            console.log('Saved new stock list of ID:', stockListID._id);
            Database.saveUser({ stockListID: stockListID._id, name }, email);
        });
    }
    static saveStock(stockObject, email, name) {
        /* TODO: must make a time stamp function to call this function once a day to update
            all present stockData
        */
        // creating stock model
        const stocks = stockObject.getStockList();
        const StockModel = mongoose_1.default.model('Stock', schemas.stock);
        const listOfStockTickers = [];
        // recursively create and save a stock model for each stock
        (function recursive() {
            const stockModel = new StockModel(stocks[0]);
            stockModel.save(function (err, stockID) {
                if (err)
                    console.error(err);
                console.log('Saved stock', stocks[0].ticker, stockID._id);
                Database.stockIDCollection.push({
                    ticker: stocks[0].ticker,
                    id: stockID._id
                });
                listOfStockTickers.push(stocks[0].ticker);
                stockObject.shiftStockList();
                if (stocks.length >= 1)
                    recursive();
                else {
                    const stockList = {
                        list: listOfStockTickers,
                        name,
                        email,
                    };
                    Database.saveStockList(stockList, email, name);
                }
            });
        }());
    }
    static getStock(userID) {
        const StockModel = mongoose_1.default.model('Stock', schemas.stock);
        return new Promise((resolve, reject) => {
            StockModel.findById(userID, function (err, res) {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    static getStockList(userID) {
        const StockModel = mongoose_1.default.model('StockList', schemas.stockList);
        return new Promise((resolve, reject) => {
            StockModel.findById(userID, function (err, res) {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    static getUser(userID) {
        const StockModel = mongoose_1.default.model('User', schemas.user);
        return new Promise((resolve, reject) => {
            StockModel.findById(userID, function (err, res) {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
}
/*
***************************************************************
***************************************************************

************************DATABASE*******************************
Every stock that is requested is made into a model and saved to
the database as a StockModel.
    The stockID, ticker and the id of the user's who have requested
    this stock are saved into a local collection for faster access.

Every stockList created with be made into a model and saved into
the database as a StockListModel
    The stockList will contain a collection of { stockID, ticker }

Every User created will be made into a model that saves into the
database an object containing { email, stockListModel[]}
***************************************************************
***************************************************************

*/
Database.stockIDCollection = [];
exports.Database = Database;
//# sourceMappingURL=database.js.map