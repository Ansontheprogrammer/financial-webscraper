import { Database } from './database';
import { StockList } from './finviz';

const setResponseHeader = res => {
	res.append('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.append('Content-Type', 'application/json')
};

export function getUser(req: any, res: any, next: any){
	setResponseHeader(res)
	const { email, name } = req.params
	Database.findStockListInDatabase(email, name).then(data => {
		console.log(`Sending portfolio ${name} with tickers: ${data.map(stock => stock.ticker)}`)
		res.json(data)
	}, err => next(`No portfolio was found under name: ${name}`, err))
}

export function postStockList(req: any, res: any, next: any){
	setResponseHeader(res);
	const { name, email } = req.body;
	let tickerList: string[] = req.body.tickerList;
	console.log('Storing new stock list', email, tickerList);
	const stockList = new StockList();
		
	function setStockData(){
		let retries = 2;
		let count = 0;

		function saveStockData(){
			// convert all stock tickers to capital letters before retrieving stock data
			tickerList = tickerList.map(ticker => ticker.toUpperCase());
			tickerList.forEach((ticker: string) => {
				StockList.getStockDataFromFinviz(ticker).then(stock => {
					stockList.pushToStockList(stock)
					count++
					if(count === tickerList.length|| tickerList.length === 1) {
						Database.saveStock(stockList, email, name, res).then(() => res.sendStatus(200), err => next(err))
					}
				}, err => {
					// if err call finviz up to 3 times to get stock data
					if(!retries) return next(`THERE WAS AN ERROR COLLECTING ALL STOCK DATA, HERE IS YOUR UPLOADED STOCKS`);
					else {
						retries--
						saveStockData()
					}
				})	
			})
		}
		saveStockData()
	}	
	setStockData();
}