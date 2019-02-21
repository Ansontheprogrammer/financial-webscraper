import finviz from 'finviz';

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

	public getStockDataFromFinviz(ticker: string): Promise<STOCK>{
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
			new StockList().getStockDataFromFinviz(ticker)
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


