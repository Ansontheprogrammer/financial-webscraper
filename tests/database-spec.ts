import 'mocha';
import * as assert from 'assert';
import { Database } from '../lib/database';

describe('Database class', () => { 
    const database = new Database('ansonervin@gmail.com');

    describe('findUserInDatabase', () => { 
        const expectedUser = { 
            _id: '5c54568b6855e61af094a4a4',
            stockListCollection:
            [ { list: [],
                _id: '5c54568b6855e61af094a4a5',
                stockListID: '5c54568b6855e61af094a4a3',
                name: 'tech' },
              { list: [], _id: '5c7993736a307043ec4fff04' } ],
            email: 'ansonervin@yahoo.com',
            __v: 21 
            }

        it('should return an error if user not in database', done => {
           database.findUserInDatabase(`tests.com`).then(user => {
               assert.equal(!user, true, 'User was not found in database');
               done()
           }, done)
        })

        it('should return an user in database', done => {
               database.findUserInDatabase('ansonervin@yahoo.com').then(user => {           
                   // get a sample of stock List      
                    user.stockListCollection = [].concat(user.stockListCollection[0], user.stockListCollection[1])
                    assert.deepEqual(JSON.stringify(user, null, 2), JSON.stringify(expectedUser, null, 2));
                    done()  
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
           Database.findStockInDatabase('NYT').then(stock=> {
            assert.equal(!stock, true, 'Stock was not found in database');
            done()
            }, done)
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
})