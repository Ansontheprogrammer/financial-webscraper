import * as scraper from '../scraper/scrape';

export class StockList {
    stockList: any
    constructor(stockList: string){
        this.stockList = stockList;
    }
    getStockValues(){
        this.stockList = scraper.getStocks(this.stockList)
    }
    flow(){
        if (this.stockList === []){
            setTimeout(this.flow, 1000);
        } else{
            return
        }    
    }
}
