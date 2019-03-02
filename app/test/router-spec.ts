import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';

const request = supertest(app)


describe('GET User route', () => { 
    const expectedUser = [
        {
            __v: 0,
            _id: '5c54568b6855e61af094a4a4',
            email: 'ansonervin@yahoo.com',
            stockListCollection: [
            {
                _id: '5c54568b6855e61af094a4a5',
                name: 'tech',
                stockListID: '5c54568b6855e61af094a4a3'
            }
            ]
        }
    ]

    it('should return a no user was found error, code 400', done => {
        request
        .get('/api/getUser/financeTesting@gmail.com') 
        .expect(400)
        .end(function(err, res) {
            if(err) done(err)
            assert.equal(res.text, JSON.stringify('No user was found under: email - financeTesting@gmail.com'))
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
                assert.deepEqual(res.body[0], expectedUser);
                done()
            }
        });
    })
})

describe('GET Stock list route', () => {    

    const expectedStockList = [
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
    

    it('should return a 400 error', done => {
        request
        .get('/api/getStockList/ansonervin@yahoo.com/error') 
        .expect(400)
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
                assert.deepEqual(JSON.stringify(res.body, null, 2), JSON.stringify(expectedStockList, null, 2))
                done()
            }
        });
    })
})
