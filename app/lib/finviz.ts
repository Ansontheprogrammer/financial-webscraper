import finviz from 'finviz';
import { Database } from './database';
import request from 'request';

export type STOCK = {
	ticker: string,
	dividendPercent : string,
	ROE: string,
	ROA: string,
	ROI: string,
	EPSPast5Y: string,
	price: string,
	grossMargin: string,
	profitMargin: string,
	operatingMargin: string,
	marketCap: string
}

export type STOCK_MODEL = {
	name: string,
	list: string[],
	email: string,
}

export class StockList {
	private stockList: STOCK[];

    constructor(){
		this.stockList = [];
    }

    public getStockList(): STOCK[] {
        return this.stockList;
	}
	
	public shiftStockList(): void {
		this.stockList.shift();
	}

	public pushToStockList(stock: STOCK): void {
		this.stockList.push(stock)
	}

	public static getStockDataFromFinviz(ticker: string): Promise<STOCK>{
		return new Promise((resolve, reject) => {
			finviz.getStockData(ticker)
			.then((allStockData: any) => resolve(StockList.filterStockProps(allStockData, ticker)))
			.catch((err: any) => reject(err))
		})
	}
	
	private static filterStockProps(data: any, ticker: string): STOCK{
		// during times of the market, data must be retrieved multiple times
		if(!data){
			console.error('Data not retrieved, fetching again')
			StockList.getStockDataFromFinviz(ticker)
		} else { console.log('Retrieved Data for: ', ticker) }
	
		return {
			ticker,
			dividendPercent : data['Dividend %'],
			ROE: data.ROE,
			ROA: data.ROA,
			ROI: data.ROI,
			EPSPast5Y: data['EPS past 5Y'],
			price: data.Price,
			grossMargin: data['Gross Margin'],
			profitMargin: data['Profit Margin'],
			operatingMargin: data['Oper. Margin'],
			marketCap: data['Market Cap']
		}
	}
}

const setResponseHeader = res => {
	res.append('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.append('Content-Type', 'application/json')
};

export function getUser(req: any, res: any, next: any){
	setResponseHeader(res)
	const { email, name } = req.params
	Database.findStockListInDatabase(email, name).then(data => {
		console.log(`Sending data for tickers: ${data.map(stock => stock.ticker)}`)
		res.json(data)
	}, err => console.error(`No portfolio was found under name: ${name}`))
}

export function postStockList(req: any, res: any, next: any){
	setResponseHeader(res);
	const { name, email, tickerList } = req.body;
	console.log('Storing new stock list', email, tickerList);
	const stockList = new StockList();
		

	function setStockData(){
		let retries = 2;
		let count = 0;

		function retryIfNeeded(){
			tickerList.forEach((ticker: string) => {
				StockList.getStockDataFromFinviz(ticker).then(stock => {
					stockList.pushToStockList(stock)
					count++
					if(count === tickerList.length|| tickerList.length === 1) {
						Database.saveStock(stockList, email, name, res).then(() => res.sendStatus(200), err => next(err))
					}
				}, err => {
					// if err call finviz up to 3 times to get stock data
					if(!retries) return next(`THERE WAS AN ERROR COLLECTING ALL STOCK DATA, HERE IS YOUR UPLOADED STOCKS` );
					else {
						retries--
						retryIfNeeded()
					}
				})	
			})
		}
		retryIfNeeded()
	}	
	setStockData();
}
