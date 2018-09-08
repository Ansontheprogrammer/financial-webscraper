const should = require('chai').should(); //actually call the function
const stock = require('../app/webscraper/finviz/scrape.js');

describe("Are the stock functions typeof 'function'", function(){
	it('filterStockProps function', function(){
		stock.filterStockProps.should.be.a('function');
	});
	it('getStockList should be a function', function(){
		stock.getStockList.should.be.a('function');
	})
	it('finvizCall should be a function', function(){
		stock.finvizCall.should.be.a('function');
	})
	it('stockGetProps should be a function', function(){
		stock.stockGetProps.should.be.a('function');
	})
	it('should have a Stock constructor function', function(){
		stock.Stock.should.be.a('function');
	});
	it('should have a Stock Portfolio constructor function', function(){
		stock.Stock.should.be.a('function');
	});
})
describe("Checking return values of functions", function(){
	it('getStockList should return a list passed to it', function(){;
		stock.getStockList(['NYMT','GPX']).should.deep.equal(['NYMT','GPX']);
	})
	it('finvizCall should return a data object', function(){
		let stock = stock.finvizCall('NYMT') 
		stock.should.deep.equal.an('object');
	})
	it('stockGetProps should return a data object', function(){;
		let getProps = stock.stockGetProps(Stock.finvizCall);
		getProps.should.deep.equal({})
	})
})
describe("Call finviz api for all stock tickers in list",function(){
	it('should pass finvizCall each ticker', function(){

	})
});
describe("Use a data filter function and return data",function(){});
describe("Pass all the data from stock tickers to a list",function(){});
describe("Stringify data and use a write stream to write a json file of data",function(){});
