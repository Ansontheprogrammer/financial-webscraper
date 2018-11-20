import * as models from '../config/models';

function sendMessages(message:string, res: any){
    console.log(message);
    res.send(message)
}
export function getStockListHandler(req: any, res: any){
    res.header({
		'Access-Control-Allow-Origin': 'http://localhost:3000'
	});
    res.status(200);
    res.set('content/type', 'application/json')
    sendMessages("===Connection made, redirecting to JSON server", res)
    res.redirect(302, 'http://localhost:3004/posts');
}

export function postStockListHandler(req: any, res: any){
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
	});
    res.status(200)
    sendMessages("===Calling finviz", res);
    let stockList = new models.StockList(req.body.stockList);
    res.send(stockList.getStockValues());
}

