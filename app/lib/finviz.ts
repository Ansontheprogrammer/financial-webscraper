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

const setResponseHeader = res => res.set({
	'Access-Control-Allow-Origin': 'http://localhost:3000',
	'Content-Type': 'application/json',
});

export function getStockList(req: any, res: any, next: any){
	setResponseHeader(res)
	Database.getStockList(req.params.id).then(data => {
		res.json(data)
	}
	, err => next(err))
}

export function getStock(req: any, res: any, next: any){
	setResponseHeader(res)

	Database.getStock(req.params.id).then(data => {
		res.json(data)
	}
	, err => next(err))
}

export function getUser(req: any, res: any, next: any){
	setResponseHeader(res)

	Database.getUser(req.params.id).then(data => {
		res.json(data)
	}
	, err => next(err))
}

export function webhook(req, res, next){
	const { data, email } = req.params;
	
	res.send('Okay redirecting')
	res.redirect(`/api/webhook/${data}/${email}`)
}

export function postStockList(req: any, res: any, next: any){
	setResponseHeader(res);

	const { tickerList, name, email } = req.body;
	const stockList = new StockList();
		

	function setStockData(){
		let retries = 2;
		let count = 0;

		function retryIfNeeded(){
			tickerList.forEach((ticker: string) => {
				StockList.getStockDataFromFinviz(ticker).then(stock => {
					stockList.pushToStockList(stock)
					count++
					if(count === tickerList.length - 1 || tickerList.length === 1) {
						// Retrieved all stock data
						Database.saveStock(stockList, email, name)
						// should send a request to an internal webhook when completed
					}
				}, err => {
					// if err call finviz up to 3 times to get stock data
					if(!retries) return next(`THERE WAS AN ERROR COLLECTING ALL STOCK DATA, HERE IS YOUR UPLOADED STOCKS\n ${stockList.getStockList()}` );
					else {
						retries--
						retryIfNeeded()
					}
				})	
			})
		}

		retryIfNeeded()
	}	

	res.status(202).send('Stocks were accected and are now processing.');
	setStockData();
}