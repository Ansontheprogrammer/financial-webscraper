import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import sinon from 'sinon';
import nock from 'nock';

const request = supertest(app)

describe('Database GET routes', () => {
    
    describe('GET user', () => {    
        const expectedStockList = [ 
            { list: [ 'NYMT', 'AAPL', 'NASQ' ],
                _id: '5c3656f62ade41500c25bebb',
                name: 'Test Investments',
                email: 'financeTesting@gmail.com',
                __v: 0 },
            { list: [ 'NYMT', 'AAPL', 'NASQ' ],
                _id: '5c36573627cb120afcf1d5d4',
                name: 'Test Investments',
                email: 'financeTesting@gmail.com',
                __v: 0 },
            { list: [ 'NYMT', 'AAPL', 'NASQ' ],
                _id: '5c3658a55abb8e13d0009a8a',
                name: 'Test Investments',
                email: 'financeTesting@gmail.com',
                __v: 0 },
            { list: [ 'NRMT', 'AARGPL', 'NASDSQ' ],
                _id: '5c36595fe979795c4c509870',
                name: 'Test Investments',
                email: 'financeTesting@gmail.com',
                __v: 0 
            } 
        ]
        

        it('should return a valid stockList', done => {
            nock('http://127.0.0.1:49176', {"encodedQueryParams":true})
            .get('/api/getUser/financeTesting@gmail.com')
            .reply(200, [{"list":["NYMT","AAPL","NASQ"],"_id":"5c3656f62ade41500c25bebb","name":"Test Investments","email":"financeTesting@gmail.com","__v":0},{"list":["NYMT","AAPL","NASQ"],"_id":"5c36573627cb120afcf1d5d4","name":"Test Investments","email":"financeTesting@gmail.com","__v":0}])
     
            request
            .get('/api/getUser/financeTesting@gmail.com') 
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
})
