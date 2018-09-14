import { Agent } from "https";

const request = require('superagent');
const host = "http://localhost:25/api/stockList"

let body = {stockList: ['NYMT', 'GPX']}

request
.post(host)
.send(body)
.end((err:any, res:any) => {
    if(err) console.error(err);
    console.log(res)
})

