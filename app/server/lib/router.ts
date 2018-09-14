import * as models from '../config/models';

export function stockListHandler(req: any, res: any){
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000'
	});
    res.status(200)
    let stockList = new models.StockList(req.body.stockList);
    stockList.sendEmail();
    res.end();
}
