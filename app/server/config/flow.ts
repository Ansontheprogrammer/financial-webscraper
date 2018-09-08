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
// export class CollectionOfStockLists{
//     collections: object[] = [];
//     industries: any = {
//         // All the industries will be listed. Need to import the stock interface
//         healthCare: [],
//     }
//     public constructor(collection?: any){
//         if(collection){
//             this.collections.push(collection);
//         }
//     }
//     private separateByIndustry(){
//         this.collections.forEach((col: any) => {
//             switch (col.industry){
//                 case 'healthCare':
//                     this.industries.healthCare.push(col);
//             }

//         })
//     }
//     private separateBySector(){
        
//     }

    /*Methods:
        Separate by Industry and sector functions*self invoking
        Get Recent Collection
        Sort from and have choices between stock properties
        Add a collection
        Delete a collection
        Get all collections
        Create New collection
//     */
// }
