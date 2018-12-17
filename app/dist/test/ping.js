"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const request = supertest_1.default(app_1.app);
describe('Ping GET route', () => {
    it('should return calling finviz', done => {
        request
            .get('/api/ping')
            .expect(200)
            .end(function (err, res) {
            if (err)
                done(err);
            else
                done();
        });
    });
});
//# sourceMappingURL=ping.js.map