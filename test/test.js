const should = require('chai').should(); //actually call the function
const Stock = require('../app/webscraper/finviz/scrape.js');

describe('Stock', function(){
	it('app should return Stock', function(){
		Stock.should.be.a('function');
	})[]
})