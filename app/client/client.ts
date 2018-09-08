import request = require('request');
const host = "https://461ce3d5.ngrok.io/api/postStockList/"
// const hostHome = "http://localhost:3000/";
var options = {
    json: true,
}
let response: any;
request.post(host,{form:{stockList: ['NYMT', 'GPX']}},(req:any, res:any)=>{
    console.log(res);
})

