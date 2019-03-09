import 'mocha';
import * as assert from 'assert'
import { StockList } from '../lib/finviz';
import finviz from 'finviz';
import sinon from 'sinon'

export const expectedStockData = { 
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

describe('Stocklist class', () => {
    let stockList: StockList
     // stub out finviz package
     sinon.stub(finviz, 'getStockData').callsFake(stock => {
        assert.equal(stock, 'NYMT', 'correctly stubbed finviz package');
        return Promise.resolve(sampleStockData)
    })

    beforeEach(() => {
        stockList = new StockList();
        stockList.setTickerList(['NYMT'])
    })  

    const expectedStockData = {
        EPSPast5Y: '4.4%',
        ROE: '2.3%',
        ROA: '5.4%',
        ROI: '9.23%',
        dividendPercent: '13.4%',
        grossMargin: '4.32%',
        marketCap: '1.03B',
        operatingMargin: '4.32%',
        price: '4.32',
        profitMargin: '7.23%',
        ticker: 'NYMT'
      }

    const sampleStockData = {
        ticker: 'NYMT',
        'Dividend %': '13.4%',
        ROE: '2.3%',
        ROA: '5.4%',
        ROI: '9.23%',
        'EPS past 5Y': '4.4%',
        'Price': '4.32',
        'Gross Margin': '4.32%',
        'Profit Margin': '7.23%',
        'Oper. Margin': '4.32%',
        'Market Cap': '1.03B',
        exchange: 'NASDAQ', 
        textProperty: 'TEST',
        dividend: '$10.40' 
    }

   it('should get stock list', () => {
        assert.deepEqual(stockList.getStockList(), [], 'should be an empty array')
   })
   
   it('should retieve stock data from finviz', done => {    
       stockList.getStockDataFromFinviz().then(() => {
            assert.deepEqual(stockList.getStockList()[0], expectedStockData)
            done()
        }, done);
       
    })

    it('retrieveStocksFromFinviz func', done => { 
        stockList.retrieveStocksFromFinviz(0).then(stock => {
            assert.deepEqual(stock, expectedStockData)
            done()
        }, done)
    })

    it('should push to stockList property', () => {
       stockList.pushToStockList(expectedStockData)
       assert.equal(stockList.getStockList().length, 1)
    })

    it('should filter stock properties correctly', () => {
        assert.deepEqual(stockList.filterStockProps(sampleStockData, 'NYMT'), expectedStockData)
    })
})
