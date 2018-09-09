const express = require('express');
import * as flow from './config/flow';

const port = process.env.PORT || 80;
export const app = (express as any)();
const bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies

app.get('/api/stockList', function(req: any, res: any){
    res.header({
		'Access-Control-Allow-Origin': 'http://localhost:3000'
	});
    res.status(200)
    res.redirect('http://localhost:3004/posts')
})
app.post('/api/stockList', function(req: any, res: any){
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000'
	});
    res.status(200)
    let stocklist = new flow.StockList(req.body.stockList);
    res.send(stocklist.getStockValues())
});
app.listen(port,function(){
    console.log('Server is listening on port ' + port)
});