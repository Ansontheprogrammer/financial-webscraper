import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import { Database } from '../lib/database';

const request = supertest(app)

describe('Database class', () => { 
    describe('findUserInDatabase', () => { 

        const expectedUser = { 
            _id: '5c54568b6855e61af094a4a4',
            stockListCollection:
            [ { _id: '5c54568b6855e61af094a4a5',
                stockListID: '5c54568b6855e61af094a4a3',
                name: 'tech' } ],
            email: 'ansonervin@yahoo.com',
            __v: 0 
            }

        it('should return an error  if user not in database', done => {
            Database.findUserInDatabase('ansonervin@gmail.com').then(user => {}, 
                err => {
                    assert.equal(err, 'No user was found' )
                    done()
                })
        })

        it('should return an user in database', done => {
                Database.findUserInDatabase('ansonervin@yahoo.com').then(user => {
                    assert.equal(JSON.stringify(user[0], null, 2), JSON.stringify(expectedUser, null, 2));
                    done()
                }, done)
            })

        it('should return an user without converting user to js object', done => {    
            Database.findUserInDatabase('ansonervin@yahoo.com', true).then(user => {
                    assert.equal(user[0].hasOwnProperty('_doc'), true);
                    done()
                }, done)
            })
    })

    describe('findStockInDatabase', () => { 
        it('should return an error is stock not in database', done => {
            Database.findStockInDatabase('NYT').then(stock=> {}, 
                err => {
                    assert.equal(err, 'Stock not in database' )
                    done()
                })
        })

        it('should return stock in database', done => {
            const expectedStock = { 
                _id: '5c54568a6855e61af094a4a1',
                ticker: 'NYMT',
                dividendPercent: '12.74%',
                ROE: '13.90%',
                ROA: '0.80%',
                ROI: '0.80%',
                EPSPast5Y: '-11.60%',
                price: '6.28',
                grossMargin: '30.40%',
                profitMargin: '19.40%',
                operatingMargin: '24.50%',
                marketCap: '1.06B',
                __v: 0 }

            Database.findStockInDatabase('NYMT').then(stock => {
                assert.deepEqual(JSON.stringify(stock, null, 2), JSON.stringify(expectedStock, null, 2))
                done()
            }, done)
        })
    })

    describe('findStockListInDatabase', () => { 
        it('should return an error is stock not in database', done => {
            Database.findStockListInDatabase('ansonervin@gmail.com', 'test').then(stock=> {}, 
                err => {
                    assert.equal(err, 'Stock list not in database' )
                    done()
                })
        })

        it.only('should return stock list in database', done => {
            const expectedStockList= [
                {
                  "_id": "5c54568a6855e61af094a49e",
                  "ticker": "AAPL",
                  "dividendPercent": "1.75%",
                  "ROE": "48.70%",
                  "ROA": "16.00%",
                  "ROI": "26.60%",
                  "EPSPast5Y": "16.50%",
                  "price": "166.44",
                  "grossMargin": "38.30%",
                  "profitMargin": "22.40%",
                  "operatingMargin": "26.70%",
                  "marketCap": "799.18B",
                  "__v": 0
                },
                {
                  "_id": "5c54568a6855e61af094a49f",
                  "ticker": "GOOG",
                  "dividendPercent": "-",
                  "ROE": "-",
                  "ROA": "-",
                  "ROI": "-",
                  "EPSPast5Y": "-",
                  "price": "1116.37",
                  "grossMargin": "-",
                  "profitMargin": "-",
                  "operatingMargin": "-",
                  "marketCap": "760.15B",
                  "__v": 0
                },
                {
                  "_id": "5c54568a6855e61af094a4a0",
                  "ticker": "CRON",
                  "dividendPercent": "-",
                  "ROE": "-",
                  "ROA": "-",
                  "ROI": "-",
                  "EPSPast5Y": "-",
                  "price": "19.68",
                  "grossMargin": "-",
                  "profitMargin": "-",
                  "operatingMargin": "-",
                  "marketCap": "3.52B",
                  "__v": 0
                },
                {
                  "_id": "5c54568a6855e61af094a4a2",
                  "ticker": "MSFT",
                  "dividendPercent": "1.76%",
                  "ROE": "23.10%",
                  "ROA": "7.40%",
                  "ROI": "17.60%",
                  "EPSPast5Y": "8.50%",
                  "price": "104.43",
                  "grossMargin": "65.20%",
                  "profitMargin": "16.40%",
                  "operatingMargin": "32.40%",
                  "marketCap": "794.37B",
                  "__v": 0
                },
                {
                  "_id": "5c54568a6855e61af094a4a1",
                  "ticker": "NYMT",
                  "dividendPercent": "12.74%",
                  "ROE": "13.90%",
                  "ROA": "0.80%",
                  "ROI": "0.80%",
                  "EPSPast5Y": "-11.60%",
                  "price": "6.28",
                  "grossMargin": "30.40%",
                  "profitMargin": "19.40%",
                  "operatingMargin": "24.50%",
                  "marketCap": "1.06B",
                  "__v": 0
                }
              ]

            Database.findStockListInDatabase('ansonervin@yahoo.com', 'tech').then(stockList => {
                assert.deepEqual(JSON.stringify(stockList, null, 2), expectedStockList)
                done()
            }, done)
        })
    })
})
