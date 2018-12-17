import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import finviz from 'finviz';
import mongoose from 'mongoose';
import { Database } from '../lib/database';
import sinon from 'sinon';

const request = supertest(app)

describe('Database GET routes', () => {
    const sandbox = sinon.sandbox.create();

    describe('GET stock list', () => {
        const expectedStockList = { 
            list: [ 'CCI', 'PSA', 'NYMT', 'SPG', 'AMT', 'NDAQ', 'PLD' ],
            _id: '5c166d70543eb80d30d85d9d',
            name: 'First Investment',
            email: 'ansonervin@gmail.com',
            __v: 0 
        }
    
        it('should return a valid stockList', done => {
            request
            .get('/api/getStockList/5c166d70543eb80d30d85d9d') 
            .expect(200)
            .end(function(err, res) {
                if (err) done(err);
                else {
                    assert.deepEqual(res.body, expectedStockList);
                    done()
                }
            });
        })
    })

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
        }

        sandbox.stub(finviz, 'getStockData').callsFake(ticker => {
            return new Promise((resolve, reject) => resolve(expectedStock))
        })
    
        it('should return a valid stock', done => {
            request
            .get('/api/getStock/5c166d6f543eb80d30d85d97') 
            .expect(200)
            .end(function(err, res) {
                if (err) done(err);
                else {
                    assert.deepEqual(res.body, expectedStock);
                    done()
                }
            });
        })
    })

    describe('GET user', () => {
        const expectedUser = { 
            _id: '5c166d70543eb80d30d85d9e',
            stockListCollection:
             [ { _id: '5c166d70543eb80d30d85d9f',
                 name: 'First Investment',
                 stockListID: '5c166d70543eb80d30d85d9d' } ],
            email: 'ansonervin@gmail.com',
            __v: 0 }
    
        it('should return a valid user', done => {
            request
            .get('/api/getUser/5c166d70543eb80d30d85d9e') 
            .expect(200)
            .end(function(err, res) {
                if (err) done(err);
                else {
                    assert.deepEqual(res.body, expectedUser);
                    done()
                }
            });
        })
    })
})

describe('should complete whole stock list -> database POST route', () =>{
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
        .end(function(err, res) {
            if (err) done(err)
            else {
                console.log(res);
                done();
            }
        });
    })

    it('should start processing stockList', done => {  
        request
        .post('/api/postStockList') 
        .send({
            tickerList,
            name: 'Safe Investments',
            email: 'anson@gmail.com',
        })
        .expect(203)
        .end(function(err, res) {
            if (err) done(err);
            else done();
        });
    })

    it('should redirect to get stockList', done => {  
        
        request
        .post('/api/postStockList') 
        .send({
            tickerList,
            name: 'Safe Investments',
            email: 'anson@gmail.com',
        })
        .expect(200)
        .end(function(err, res) {
            if (err) done(err);
            else done();
        });
    })
})
