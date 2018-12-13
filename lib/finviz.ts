import finviz from 'finviz';
import { Database } from './database';

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

	public static getStocks(ticker: string): Promise<STOCK>{
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
			StockList.getStocks(ticker)
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

export function getStockList(req: any, res: any, next: any){
	Database.getStockList(req.params.id).then(data => {
		res.json(data);
	}, err => next(err))
}

export function getStock(req: any, res: any, next: any){
	Database.getStock(req.params.id).then(data => {
		res.json(data);
	}, err => next(err))
}

export function getUser(req: any, res: any, next: any){
	Database.getUser(req.params.id).then(data => {
		res.json(data);
	}, err => next(err))
}

export function postStockList(req: any, res: any, next: any){
	const { tickerList, name, email } = req.body;
	const stockList = new StockList();	
	const setData = setStockData();

	res.send("Retrieving stock data from finviz");
	setData();

	function setStockData(){
		let retries = 3;
		let count = 0;

		return function retryIfNeeded(){
			tickerList.forEach((ticker: string) => {
				StockList.getStocks(ticker).then(stock => {
					stockList.pushToStockList(stock)
					count++
					if(count === tickerList.length - 1 || tickerList.length === 1) {
						res.send("Saving data to database");
						res.setStatus(200);
						// Retrieved all stock data
						Database.saveStock(stockList, email, name)
					}
				}, err => {
					// if err call finviz up to 3 times to get stock data
					if(!retries) throw err;
					retries--
					retryIfNeeded()
				})
			})
		}
	}	
}
