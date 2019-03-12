import { Database } from './database';
import { StockList } from './finviz';

const setResponseHeader = res => {
	res.append('Access-Control-Allow-Origin', '*')
	res.append('Content-Type', 'application/json')
};

export function getUser(req: any, res: any, next: any){
	setResponseHeader(res)
	const email = req.params.email
	new Database(email).findUserInDatabase(email, true).then(user => {
		// if user is not found return a 404 error
		if(!user) return res.status(404).send(JSON.stringify(`No user was found under: email - ${email}`)) 
		console.log(`Sending user ${email}`)
		res.json(user)
	}, next)
}

export function getStockList(req: any, res: any, next: any){
	setResponseHeader(res)
	const { email, name } = req.params
	new Database(email).findStockListInDatabase(name).then(stockList => {
		if(!stockList) return res.status(404).send(JSON.stringify(`No stock list was found under: email - ${name}`))
		console.log(`Sending portfolio ${name} with tickers: ${stockList.map(stock => stock.ticker)}`)
		res.json(stockList)
	}, next)
}

export function startUserFlow(req: any, res: any, next: any){
	// This route takes a name, and email that are strings. Also the tickerList must be an array.
	setResponseHeader(res);
	const { email, name } = req.body;
	// finviz package requires uppercase tickers
	const tickerList: string[] = req.body.tickerList.map(ticker => ticker.toUpperCase());
	const stockList = new StockList();
	const database = new Database(email)

	stockList.setTickerList(tickerList);
	stockList.getStockDataFromFinviz()
	.then(() => database.storeUserAndStockList(stockList, email, name))
	.then(() => res.sendStatus(200))
	.catch(next)
}