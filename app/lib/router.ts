import { Database } from './database';
import { StockList } from './finviz';

const setResponseHeader = res => {
	res.append('Access-Control-Allow-Origin', '*')
	res.append('Content-Type', 'application/json')
};

export function getUser(req: any, res: any, next: any){
	setResponseHeader(res)
	const { email, name } = req.params
	Database.findStockListInDatabase(email, name).then(data => {
		console.log(`Sending portfolio ${name} with tickers: ${data.map(stock => stock.ticker)}`)
		res.json(data)
	}, err => next(`No portfolio was found under: email - ${email} and name - ${name}`, err))
}

export function retrieveStockData (req: any, res: any, next: any){
	// This route takes a name, and email that are strings. Also the tickerList must be an array.
	setResponseHeader(res);
	const { name, email} = req.body;
	let tickerList: string[] = req.body.tickerList;
	let count = 0;
	let retries = 2;
	const stockList = new StockList();

	function retrieve(){
		tickerList.forEach((ticker: string) => {
			stockList.getStockDataFromFinviz(ticker).then(stock => {
				stockList.pushToStockList(stock)
				count++
				if(count === tickerList.length|| tickerList.length === 1) {
					if(email) Database.saveStock(stockList, email, name, res).then(() => res.sendStatus(200), err => next(err)) 
					else res.json(stockList.getStockList())
				}
			}, err => {
				// if err call finviz up to 3 times to get stock data
				if(!retries) {
					res.sendStatus(500)
					next(`THERE WAS AN ERROR COLLECTING ALL STOCK DATA, HERE IS YOUR UPLOADED STOCKS`);
				}
				else {
					retries--
					retrieve()
				}
			})	
		})
	}

	// convert all stock tickers to capital letters before retrieving stock data
	tickerList = tickerList.map(ticker => ticker.toUpperCase());
	retrieve()
}