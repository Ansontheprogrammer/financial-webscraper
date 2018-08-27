var finviz = require('finviz');
var fs = require('fs')
let stocks = ['NYMT','GPX']
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

function createFile(){	
	if (stockList.length >= 2){
		stockList.forEach(stock => {
			let string = createStockString(stock);
			console.log(string)
			fs.appendFile('StockData.txt', string, (err) => {
			if (err) throw err;
			console.log('The file has been saved!\n', string);
			console.log('hey there')
			});
		})
	}
}
function createStockString(stock, ...args){
	return `So heres data for ${stock.ticker}\n 
	Price: ${stock.Price}\n
	Dividend Percent: ${stock.dividendPercent}\n
	Returns : \n
		ROE: ${stock.ROE}\n
		ROA: ${stock.ROA}\n
		ROI: ${stock.ROI}\n
	Margins: \n
		Gross Margin: ${stock.grossMargin}\n
		Profit Margin: ${stock.profitMargin} \n
		operatingMargin: ${stock.operatingMargin} \n
	EPSPast5Y: ${stock.EPSPast5Y}\n\n`
}

function filterStockProps(data={},ticker){
	console.log(data);
	let stockData = {
		ticker: ticker,
		dividendPercent : data['Dividend %'],
		ROE: data.ROE,
		ROA: data.ROA,
		ROI: data.ROI,
		EPSPast5Y: data['EPS past 5Y'],
		Price: data.Price,
		grossMargin: data['Gross Margin'],
		profitMargin: data['Profit Margin'],
		operatingMargin: data['Oper. Margin']
	}
	console.log(stockData);
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
	            	createFile()
	            })
	            .catch(err => console.error(err.stack ? err.stack : err));
		} 
}

function getStocks(){
	stocks.forEach(stock => finvizCall(stock));
}
function flow(){
	if (stockList === []){
		setTimeOut(flow, 3000);
	} else{
		return
	}
}
