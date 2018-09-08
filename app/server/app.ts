const express = require('express');
import * as flow from './config/flow';

const port = process.env.PORT || 80;
export const app = (express as any)();
const bodyParser = require('body-parser')
let random: any;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies

app.get('/api/getStockList', function(req: any, res: any){
    console.log(random.stockList)
})
app.post('/api/postStockList', function(req: any, res: any){
    random = new flow.StockList(req.body.stockList);
    res.send(random.getStockValues())
});
app.listen(port,function(){
    console.log('Server is listening on port ' + port)
});