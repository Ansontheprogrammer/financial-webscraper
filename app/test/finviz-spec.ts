import 'mocha';
import { app } from '../app'
import * as assert from 'assert';
import supertest from 'supertest';
import { StockList } from '../lib/finviz';

const request = supertest(app)

describe('Stocklist class', () => { 
    const stockList = new StockList();

    const expectedStockData = { 
        ticker: 'NYMT',
        dividendPercent: '13.33%',
        ROE: '13.40%',
        ROA: '0.80%',
        ROI: '0.80%',
        EPSPast5Y: '-11.60%',
        price: '6.00',
        grossMargin: '30.40%',
        profitMargin: '18.70%',
        operatingMargin: '23.20%',
        marketCap: '1.02B' }

    const sampleStockData = {
        'Dividend %': '13.4%',
        ROE: '2,3%',
        ROA: '5.4%',
        ROI: '9.23%',
        'EPS past 5Y': '4.4%',
        'Price': '4.32',
        'Gross Margin': '4.32%',
        'Profit Margin': '7.23%',
        'Oper. Margin': '4.32%',
        'Market Cap': '1.03B',
        exchange: 'NASDAQ', 
        dividend: '$10.40' 
    }

    const expectedFilteredStockData = { 
        ticker: 'TEST',
        dividendPercent: '13.4%',
        ROE: '2,3%',
        ROA: '5.4%',
        ROI: '9.23%',
        EPSPast5Y: '4.4%',
        price: '4.32',
        grossMargin: '4.32%',
        profitMargin: '7.23%',
        operatingMargin: '4.32%',
        marketCap: '1.03B' 
    }

   it('should get stock list', () => {
        assert.deepEqual(stockList.getStockList(), [], 'should be an empty array')
   })
   
   it('should retieve stock data from finviz', function(done) {
       // create a stub of the finviz package because stock data changes frequently
       this.timeout(10000)
        stockList.getStockDataFromFinviz('NYMT').then(stock => {
            assert.deepEqual(JSON.stringify(stock), JSON.stringify(expectedStockData));  
            done()
        }, done)
    })

    it('should push to stockList property', () => {
       stockList.pushToStockList(expectedStockData)
       assert.equal(stockList.getStockList().length, 1)
    })

    it('should remove stock list', () => {
        stockList.shiftStockList()
        assert.equal(stockList.getStockList().length, 0)
    })

    it('should filter stock properties correctly', () => {
        assert.deepEqual(StockList.filterStockProps(sampleStockData, 'TEST'), expectedFilteredStockData)
    })
})
