var finviz = require('finviz');

function StockPortfolio(tickers){

	function getStockList(list){
		console.log(this.stockList)
    	return this.stockList
	}
	function filterStockProps(data={}){
		let stockData = {
			ticker: data.Ticker,
			dividendPercent : data.Dividend,
			ROE: data.ROE,
			// operatingMargin: data.operatingMargin
		}
		console.log('Returning this stock data')
		return stockData;
	}
	function finvizCall(ticker){
		if(ticker !== ''){
		        finviz.getStockData(ticker)
		            .then(data => {
		            	console.log(`Symbol ${data.Ticker} \n Dividend:${data.Dividend} \n ROE: ${data.ROE}`)})
		            .catch(err => console.error(err.stack ? err.stack : err));
			} 
	}

	function stockGetProps(callback){
		let stockList = [];
		tickers.forEach((stock)=>{
			finvizCall(stock);
		});
		console.log('Returning stockList')
		
	}
	finvizCall('NYMT')



}


let bayArea = StockPortfolio(['NYMT', 'ARNC', 'GPX']);




/* need to create a dataFilter object with req ratios:
	need to create a calculate function that uses the data from getStock
	 */