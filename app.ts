import * as finviz from './lib/finviz'
const express = require('express');
export const app = (express as any)();
const port = process.env.PORT || 80;
const bodyParser = require('body-parser')

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies

app.get('/', (req: any, res: any, next: any) => {
  res.send('Inside test root route');
})
app.get('/api/getStockList/:id', finviz.getStockList)
app.post('/api/postStockList', finviz.postStockList);
app.post('/api/compoundInterest', () => {})
app.listen(port, () => console.log('Server is listening on port ' + port));