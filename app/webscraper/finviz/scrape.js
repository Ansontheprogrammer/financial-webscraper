var finviz = require('finviz');
var fs = require('fs')
let stocks = "OPHT FWP TYHT CERC AMS AEZS".split(' ')
let stockNum = stocks.length;
let stockList = [];

/* 
	To get data on diffent stocks, simply change the stocks list.
	To filter different stock data:
		Adjust filterStockProps
			Log the value of the passed data object and adjust the stockData object
			Adjust createStockString 
				Change the template string to reflect your changes
		
*/
(function(){
	getStocks()
	flow()
}())

function createFile(num){
	// Wait for list to be made	
	if (stockList.length >= num){
		stockList.forEach(stock => {
			let string = createStockString(stock);
			console.log(string)
			fs.appendFile('Stocks-HealthCare.txt', string, (err) => {
			if (err) throw err;
			console.log('The file has been saved!\n', string);
			});
		})
	}
}
function createStockString(stock, ...args){
	return `Ticker: ${stock.ticker}\n 
	Price: ${stock.price}
	Market Cap: ${stock.marketCap} 
	Dividend Percent: ${stock.dividendPercent}
	Returns : \n
		ROE: ${stock.ROE}
		ROA: ${stock.ROA}
		ROI: ${stock.ROI}\n
	Margins: \n
		Gross Margin: ${stock.grossMargin}
		Profit Margin: ${stock.profitMargin} 
		Operating Margin: ${stock.operatingMargin}\n
	EPSPast5Y: ${stock.EPSPast5Y}\n\n`
}

function filterStockProps(data={},ticker){
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
	stockList.push(stockData);
	return stockList
}
function finvizCall(ticker){
	if(ticker !== ''){
	        finviz.getStockData(ticker)
	            .then(data => {
	            	filterStockProps(data,ticker);
	            })
	            .then(data => {
	            	createFile(stockNum)
	            })
	            .catch(err => console.error(err.stack ? err.stack : err));
		} 
}

function getStocks(){
	stocks.forEach(stock => finvizCall(stock));
}
function flow(){
	if (stockList === []){
		setTimeOut(flow, 1000);
	} else{
		return
	}
}
