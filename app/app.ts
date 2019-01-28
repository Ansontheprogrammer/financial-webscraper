import * as router from './lib/router'
import  * as express from  'express';
import  * as bodyParser from 'body-parser';

export const app = (express as any)();
const port = process.env.PORT || 80;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static('public'))

app.get('/api/node/database/getUser/:email/:name', router.getUser)
app.post('/api/node/finance/postStockList', router.postStockList);
app.get('/api/ping', (req, res, next) => {
  res.sendStatus(200);
})
app.listen(port, () => {});