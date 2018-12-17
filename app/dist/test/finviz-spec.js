"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const app_1 = require("../app");
const assert = __importStar(require("assert"));
const supertest_1 = __importDefault(require("supertest"));
const finviz_1 = __importDefault(require("finviz"));
const sinon_1 = __importDefault(require("sinon"));
const request = supertest_1.default(app_1.app);
describe('Database GET routes', () => {
    const sandbox = sinon_1.default.sandbox.create();
    describe('GET stock list', () => {
        const expectedStockList = {
            list: ['CCI', 'PSA', 'NYMT', 'SPG', 'AMT', 'NDAQ', 'PLD'],
            _id: '5c166d70543eb80d30d85d9d',
            name: 'First Investment',
            email: 'ansonervin@gmail.com',
            __v: 0
        };
        it('should return a valid stockList', done => {
            request
                .get('/api/getStockList/5c166d70543eb80d30d85d9d')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    done(err);
                else {
                    assert.deepEqual(res.body, expectedStockList);
                    done();
                }
            });
        });
    });
    describe('GET stock', () => {
        const expectedStock = {
            _id: '5c166d6f543eb80d30d85d97',
            ticker: 'PSA',
            dividendPercent: '3.93%',
            ROE: '26.50%',
            ROA: '12.10%',
            ROI: '22.40%',
            EPSPast5Y: '11.90%',
            price: '203.47',
            grossMargin: '73.30%',
            profitMargin: '47.30%',
            operatingMargin: '51.60%',
            marketCap: '35.82B',
            __v: 0
        };
        sandbox.stub(finviz_1.default, 'getStockData').callsFake(ticker => {
            return new Promise((resolve, reject) => resolve(expectedStock));
        });
        it('should return a valid stock', done => {
            request
                .get('/api/getStock/5c166d6f543eb80d30d85d97')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    done(err);
                else {
                    assert.deepEqual(res.body, expectedStock);
                    done();
                }
            });
        });
    });
    describe('GET user', () => {
        const expectedUser = {
            _id: '5c166d70543eb80d30d85d9e',
            stockListCollection: [{ _id: '5c166d70543eb80d30d85d9f',
                    name: 'First Investment',
                    stockListID: '5c166d70543eb80d30d85d9d' }],
            email: 'ansonervin@gmail.com',
            __v: 0
        };
        it('should return a valid user', done => {
            request
                .get('/api/getUser/5c166d70543eb80d30d85d9e')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    done(err);
                else {
                    assert.deepEqual(res.body, expectedUser);
                    done();
                }
            });
        });
    });
});
describe('should complete whole stock list -> database POST route', () => {
    const tickerList = ['NYMT', 'AAPL', 'NASQ'];
    it.only('should test for invalid stock ticker', done => {
        // TODO: Refactor the error handling for invalid requests
        request
            .post('/api/postStockList')
            .send({
            tickerList,
            name: 'Safe Investments',
            email: 'anson@gmail.com',
        })
            .expect(500)
            .end(function (err, res) {
            if (err)
                done(err);
            else {
                console.log(res);
                done();
            }
        });
    });
    it('should start processing stockList', done => {
        request
            .post('/api/postStockList')
            .send({
            tickerList,
            name: 'Safe Investments',
            email: 'anson@gmail.com',
        })
            .expect(203)
            .end(function (err, res) {
            if (err)
                done(err);
            else
                done();
        });
    });
    it('should redirect to get stockList', done => {
        request
            .post('/api/postStockList')
            .send({
            tickerList,
            name: 'Safe Investments',
            email: 'anson@gmail.com',
        })
            .expect(200)
            .end(function (err, res) {
            if (err)
                done(err);
            else
                done();
        });
    });
});
//# sourceMappingURL=finviz-spec.js.map