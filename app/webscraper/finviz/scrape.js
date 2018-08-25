var finviz = require('finviz');


function getStockList(list=[]){
	stockList = list
	return stockList
}

function filterStockProps(data={}){
	let stockData = {
		ticker: data.Ticker,
		dividendPercent : data.Dividend,
		ROE: data.ROE,
		// operatingMargin: data.operatingMargin
	}
	console.log('Returning this stock data', stockData)
	return stockData;
}

function finvizCall(ticker){
	if(ticker !== ''){
	        finviz.getStockData(ticker)
	            .then(data => {
	            	console.log(`Symbol ${data.Ticker} \n Dividend:${data.Dividend} \n ROE: ${data.ROE}`)
	            	return data;
	            })
	            .catch(err => console.error(err.stack ? err.stack : err));
		} 
}
function stocksGetProps(list, callFinviz, callback){
	let stockList = [];
	tickers.forEach((stock)=>{
		callFinviz(stock);
	});
	console.log('Returning stockList')
}

function Stock(ticker){
	this.ticker = ticker
}
Stock.prototype.ticker = '';

function StockPortfolio(){}

StockPortfolio.prototype.createStocks = (tickers) =>{
	let stockList = []
	tickers.forEach(ticker => {
		let stock = new Stock(ticker);
		stockList.push(stock)
	});
	return stockList
}
StockPortfolio.prototype.flow = (list)=>{
	let stockData = [];
	list.forEach(stock => {
		let afterCall = new Promise((resolve,reject)=>{
			resolve(finvizCall(stock))
		})
		afterCall.then(data => {
			stockData.push(filterStockProps(data))
		})
	})
}


let bayArea = new StockPortfolio()
let stocks = bayArea.createStocks(['NYMT','GPX'])
bayArea.flow(stocks);
exports.filterStockProps = filterStockProps;
exports.getStockList = getStockList;
exports.finvizCall = finvizCall;
exports.stockGetProps = stocksGetProps;
exports.Stock = Stock;
exports.StockPortfolio = StockPortfolio;

/* need to create a dataFilter object with req ratios:
	need to create a calculate function that uses the data from getStock
	 */