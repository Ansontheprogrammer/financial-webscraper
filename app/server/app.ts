const express = require('express');
import * as router from './lib/router';
const port = process.env.PORT || 80;
export const app = (express as any)();
const bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies

app.get('/api/stockList', router.getStockListHandler)
app.post('/api/stockList', router.postStockListHandler);
app.listen(port,function(){
    console.log('Server is listening on port ' + port)
});