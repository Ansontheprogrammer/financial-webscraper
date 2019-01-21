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
app.use(express.static('public'))

app.get('/api/getUser/:email/:name', finviz.getUser)
app.post('/api/postStockList', finviz.postStockList);
app.post('/api/compoundInterest', () => {});
app.get('/api/ping', (req, res, next) => {
  res.sendStatus(200);
})
app.listen(port, () => {});