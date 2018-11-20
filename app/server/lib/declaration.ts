var finviz = require('finviz');
var fs = require('fs')
var request = require('request');

export function createFile(stockList: object[]){
	// Wait for list to be made	
	stockList.forEach((stock: any) => {
		let string = JSON.stringify(stock);
		fs.appendFile('Stocks-HealthCare.json', string, (err: any) => {
		if (err) throw err;
		console.log('The file has been saved!\n', string);
		});
	})
}

export function addToJsonServer(stockList: object[]){
	// Wait for list to be made	
	stockList.forEach((stock: any) => {
		stock = JSON.stringify(stock);
		let jsonServer = 'http://localhost:3004/posts';
		request.post(jsonServer,{form:{stockList: stock}},(req:any, res:any)=>{
			console.log(stock, '===Request sent to json server');
		})
	})
}
export function deleteFromJsonServer(stockList: object[]){

}
export function filterStockProps(data: any, ticker: string): Stock{
	let stockData = {
		ticker: ticker,
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
	return stockData
}

export interface Stock {
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

export function getStocks(stocks: string[]): void{
	let stockDataList: object[] = [];
	
    function iterateStocks(): any {
        return stocks.forEach(function (stock: string) { 
			return finvizCall(stock, createFile, filterStockProps); 
		});
    }
    function finvizCall(ticker: string, createFileFunction: any, filterStockPropsFunction: any): void{
        if (ticker !== '') {
			finviz.getStockData(ticker)
			.then(function (data: any) {
				return filterStockPropsFunction(data, ticker);
			})
			.then(function (data: object) {
				stockDataList.push(data);
				console.log("===Received data from finviz", stockDataList)
				if(stockDataList.length >= 1){
					return stockDataList;
				} else{
					console.error("Data was not saved.", stockDataList)
				}
			})
			.then((data: object[]) => addToJsonServer(data))
			.catch((err: any) => console.error(err)
        }
	}
	return iterateStocks();
}
