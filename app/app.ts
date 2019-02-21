import * as router from './lib/router'
import  * as bodyParser from 'body-parser';
const express = require('express');

export const app = (express )();
const port = process.env.PORT || 80;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static('public'))

app.get('/api/getUser/:email/:name', router.getUser)
app.post('/api/postStockList/:email', router.retrieveStockData);
app.get('/api/ping', (req, res, next) => {
  res.sendStatus(200);
})
app.listen(port, () => {});