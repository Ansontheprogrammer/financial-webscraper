import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';

const request = supertest(app)

describe('GET User route', () => { 
    const expectedUser = {
            __v: 21,
            _id: '5c54568b6855e61af094a4a4',
            email: 'ansonervin@yahoo.com',
            stockListCollection: {
                _id: '5c54568b6855e61af094a4a5',
                list: [],
                name: 'tech',
                stockListID: '5c54568b6855e61af094a4a3'
            }
        }

    it('should return a no user was found error, code 404', done => {
        request
        .get('/api/getUser/financeTesting@gmail.com') 
        .expect(404)
        .end(function(err, res) {
            if(err) done(err)
            done()
        });
    })

    it('should return user', done => {
        request
        .get('/api/getUser/ansonervin@yahoo.com') 
        .expect(200)
        .end(function(err, res) {
            if (err) done(err);
            else {
                res.body[0].stockListCollection = res.body[0].stockListCollection[0]
                assert.deepEqual(res.body[0], expectedUser);
                done()
            }
        });
    })
})

describe('GET Stock list route', () => {    

    const expectedStockList = {
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
        }
    

    it('should return a 404 error', done => {
        request
        .get('/api/getStockList/ansonervin@yahoo.com/error') 
        .expect(404)
        .end(function(err, res) {
            if (err) done(err);
            else {
                assert.equal(res.text, JSON.stringify('No stock list was found under: email - error'))
                done()
            }
        });
    })
    
    it('should return a valid stockList', done => {
        request
        .get('/api/getStockList/ansonervin@yahoo.com/tech') 
        .expect(200)
        .end(function(err, res) {
            if (err) done(err);
            else {
                assert.deepEqual(JSON.stringify(res.body[0], null, 2), JSON.stringify(expectedStockList, null, 2))
                done()
            }
        });
    })
})
