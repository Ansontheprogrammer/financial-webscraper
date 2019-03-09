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
		if(this.tickerList.length >= 1) console.log('Ticker list is already set');
		this.tickerList = tickerList;
	}

	public pushToStockList(stock: STOCK): void {
		this.stockList.push(stock)
	}

	public async retrieveStocksFromFinviz(i: number): Promise<STOCK>{
		// Helper function that will return unfiltered stock dats 
		let stock = {}

		try {
			stock = await finviz.getStockData(this.tickerList[i])
		} catch (e) {
			// if we can't retrieve the stock lets try one more time
			try {
				stock = await finviz.getStockData(this.tickerList[i])
			} catch (e) { throw e }
		}
		// filter stock data and push to stock list
		return  this.filterStockProps(stock, this.tickerList[i])
	}

	public async getStockDataFromFinviz(): Promise<void>{
	  for(let i = 0; i <= this.tickerList.length - 1; i++){
			try {
				 const stock = await this.retrieveStocksFromFinviz(i)
				 this.pushToStockList(stock)
			} catch(e) { console.error(	`${this.tickerList[i]} was not saved	`, e)	}
		}
	}
	
	public  filterStockProps(data: any, ticker: string): STOCK{

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


