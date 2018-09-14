import * as scraper from '../lib/declaration';

export class StockList {
    stockList: any
    constructor(stockList: string){
        this.stockList = stockList;
    }
    getStockValues(){
        return scraper.getStocks(this.stockList)
    }
    sendEmail(){
        return scraper.sendEmail();
    }
    flow(){
        if (this.stockList === []){
            setTimeout(this.flow, 1000);
        } else{
            return
        }    
    }
}
