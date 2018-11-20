import * as scraper from '../lib/declaration';

export class StockList {
    stockList: string[];
    stockObjects: any;

    constructor(stockList: string[]){
        this.stockList = stockList;
        this.stockObjects = [];
    }
    getStockValues(){;
        scraper.getStocks(this.stockList); 
    }
}
