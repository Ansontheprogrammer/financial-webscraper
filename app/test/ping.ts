import 'mocha';
import { app } from '../app'
import supertest from 'supertest';

const request = supertest(app)

describe('Ping GET route', () =>{
    it('should return calling finviz', done => {
        request
        .get('/api/ping')
        .expect(200)
        .end(function(err, res) {
            if (err) done(err);
            else done()
        });
    })
})