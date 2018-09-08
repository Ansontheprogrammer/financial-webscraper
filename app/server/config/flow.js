"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var scraper = __importStar(require("../scraper/scrape"));
var StockList = /** @class */ (function () {
    function StockList(stockList) {
        this.stockList = stockList;
    }
    StockList.prototype.getStockValues = function () {
        this.stockList = scraper.getStocks(this.stockList);
    };
    StockList.prototype.flow = function () {
        if (this.stockList === []) {
            setTimeout(this.flow, 1000);
        }
        else {
            return;
        }
    };
    return StockList;
}());
exports.StockList = StockList;
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
