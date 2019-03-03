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

export class StockList {
	private stockList: STOCK[];
	private tickerList: string[];

    constructor(){
			this.stockList = [];
			this.tickerList = [];
    }

  public getStockList(): STOCK[] {
      return this.stockList;
	}

	public getTickerList(): string[] {
		return this.tickerList
	}

	public setTickerList(tickerList: string[]): void {
		if(!!this.tickerList) console.log('Ticker list is already set');
		this.tickerList = tickerList;
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
	
	public static filterStockProps(data: any, ticker: string): STOCK{
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


