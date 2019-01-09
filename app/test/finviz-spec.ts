import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import sinon from 'sinon';
import nock from 'nock';

const request = supertest(app)

describe('Database GET routes', () => {
    const sandbox = sinon.createSandbox();
    
    describe('GET stock list', () => {    
        const expectedStockList = [ { list: [ 'NYMT', 'AAPL', 'NASQ' ],
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
        __v: 0 } ]
        

        it('should return a valid stockList', done => {
            nock('http://127.0.0.1:49176', {"encodedQueryParams":true})
            .get('/api/getStockList/financeTesting@gmail.com')
            .reply(200, [{"list":["NYMT","AAPL","NASQ"],"_id":"5c3656f62ade41500c25bebb","name":"Test Investments","email":"financeTesting@gmail.com","__v":0},{"list":["NYMT","AAPL","NASQ"],"_id":"5c36573627cb120afcf1d5d4","name":"Test Investments","email":"financeTesting@gmail.com","__v":0}])
     
            request
            .get('/api/getStockList/financeTesting@gmail.com') 
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

    // describe('GET user', () => {
    //     const expectedUser = { 
    //         _id: '5c166d70543eb80d30d85d9e',
    //         stockListCollection:
    //          [ { _id: '5c166d70543eb80d30d85d9f',
    //              name: 'First Investment',
    //              stockListID: '5c166d70543eb80d30d85d9d' } ],
    //         email: 'ansonervin@gmail.com',
    //         __v: 0 }
    
    //     it('should return a valid user', done => {
    //         request
    //         .get('/api/getUser/5c166d70543eb80d30d85d9e') 
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) done(err);
    //             else {
    //                 assert.deepEqual(res.body, expectedUser);
    //                 done()
    //             }
    //         });
    //     })
    // })
// describe('should complete whole stock list -> database POST route', () =>{
//     const tickerList = ['NRMT', 'AARGPL', 'NASDSQ'];
//     it('should test for invalid stock ticker', done => {
//         // TODO: Refactor the error handling for invalid requests
//         request
//         .post('/api/postStockList') 
//         .send({
//             tickerList,
//             name: 'Safe Investments',
//             email: 'anson@gmail.com',
//         })
//         .expect(500)
//         .end(function(err, res) {
//             if (err) done(err)
//             else {
//                 console.log(res);
//                 done();
//             }
//         });
//     })

//     it('should start processing stockList', done => {  
        
//         request
//         .post('/api/postStockList') 
//         .send({
//             tickerList,
//             name: 'Test Investments',
//             email: 'process@gmail.com',
//         })
//         .expect(200)
//         .end(function(err, res) {
//             if (err) done(err);
//             else done();
//         });
//     })
})
