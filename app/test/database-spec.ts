import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import { Database } from '../lib/database';

const request = supertest(app)

function randomEmailGenerator(wordLength: number){
    const characters = ['d','e', '4', '2', '#', '(', '*', '5', '6', 'i', 'f', 'o', '5']
    let word = ''
    for(let i = 0; i <= wordLength; i++) {
        var character = characters[Math.floor(Math.random()*characters.length)];
        word += character
    }
   return word.concat('.com')
}

describe('Database class', () => { 
    const database = new Database();
    const getSampleOfStockList = stockList => stockList.map((stock, index) => index <= 1 ? stock : null).filter(stock => !!stock);

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
           database.findUserInDatabase(`${randomEmailGenerator(5)}`).then(user => {}, 
                err => {
                    assert.equal(err, 'No user was found' )
                    done()
                })
        })

        it('should return an user in database', done => {
               database.findUserInDatabase('ansonervin@yahoo.com').then(user => {
                    done()  
                    assert.equal(JSON.stringify(user[0], null, 2), JSON.stringify(expectedUser, null, 2));
                }, done)
            })

        it('should return an user without converting user to js object', done => {    
           database.findUserInDatabase('ansonervin@yahoo.com', true).then(user => {
                    assert.equal(user[0].hasOwnProperty('_doc'), true);
                    done()
                }, done)
            })
    })

    describe('findStockInDatabase', () => { 
        it('should return an error is stock not in database', done => {
           database.findStockInDatabase('NYT').then(stock=> {}, 
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

           database.findStockInDatabase('NYMT').then(stock => {
                assert.deepEqual(JSON.stringify(stock, null, 2), JSON.stringify(expectedStock, null, 2))
                done()
            }, done)
        })
    })

    describe('findStockListInDatabase', () => { 
        it('should return an error is stock not in database', done => {
           database.findStockListInDatabase('ansonervin@gmail.com', 'tests').then(stock=> {}, 
                err => {
                    assert.equal(err, 'Stock list not in database' )
                    done()
                })
        })

        it('should return stock list in database', done => {
            const expectedStockList= [ 
                { 
                _id: '5c54568a6855e61af094a49e',
                ticker: 'AAPL',
                dividendPercent: '1.75%',
                ROE: '48.70%',
                ROA: '16.00%',
                ROI: '26.60%',
                EPSPast5Y: '16.50%',
                price: '166.44',
                grossMargin: '38.30%',
                profitMargin: '22.40%',
                operatingMargin: '26.70%',
                marketCap: '799.18B',
                __v: 0 },
              { 
                _id: '5c54568a6855e61af094a4a0',
                ticker: 'CRON',
                dividendPercent: '-',
                ROE: '-',
                ROA: '-',
                ROI: '-',
                EPSPast5Y: '-',
                price: '19.68',
                grossMargin: '-',
                profitMargin: '-',
                operatingMargin: '-',
                marketCap: '3.52B',
                __v: 0 } ]

           database.findStockListInDatabase('ansonervin@yahoo.com', 'tech').then(stockList => {
                const sampleOfStockList = getSampleOfStockList(stockList)
                assert.deepEqual(JSON.stringify(sampleOfStockList, null, 2), JSON.stringify(expectedStockList, null, 2))
                done()
            }, done)
        })
    })

    describe('saveUser', () => { 
        it('should return an error, user already created', done => {
           database.saveUser({ stockListID: 'd232', name: 'TEST' }, 'ansonervin@gmail.com').then(user => {}
                , err => {
                assert.equal(err, 'User already created')
                done()
            })
        })

        it('should successfully create a new user', done => {
           database.saveUser({ stockListID: 'd232', name: 'TEST' }, `${randomEmailGenerator(6)}`).then(() => done(), done)
        })
    })
})