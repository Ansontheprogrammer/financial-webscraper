import mongoose from 'mongoose';
import { STOCK_MODEL } from './finviz';

type STOCK = {
	ticker: string,
	id: string
}

const url = 'mongodb://127.0.0.1:27017'
// connecting to mongo and creating schema
mongoose.connect(url);
const Schema = mongoose.Schema;

const stockSchema = { 
	userID: String,
	ticker: String,
	dividendPercent: String,
	ROE: String,
	ROA: String,
	ROI: String,
	EPSPast5Y: String,
	price: String,
	grossMargin: String,
	profitMargin: String,
	operatingMargin: String,
	marketCap: String
}

// *******************SCHEMA DECLARATIONS***************************
const schemas = {
	stock: new Schema(stockSchema, { autoIndex: false }),
	stockList: new Schema({ 
		name: String,
		list: [],
		email: String,
		}, { autoIndex: false }),
	user: new Schema({ 
		stockListCollection: [{ name: String, stockListID: String }],
		email: String
	 }, { autoIndex: false })
}

// **********************SCHEMA METHODS****************************

export class Database {
	/* 
	***************************************************************
	***************************************************************

	************************DATABASE*******************************
	Every stock that is requested is made into a model and saved to 
	the database as a StockModel.
		The stockID, ticker and the id of the user's who have requested
		this stock are saved into a local collection for faster access.

	Every stockList created with be made into a model and saved into
	the database as a StockListModel
		The stockList will contain a collection of { stockID, ticker }

	Every User created will be made into a model that saves into the
	database an object containing { email, stockListModel[]}
	***************************************************************
	***************************************************************
KO
	*/	
	public static stockIDCollection: STOCK[] = [];
	
	public static saveUser(stockListInfo, email){
		const UserModel = mongoose.model('User', schemas.user);
		
		const user = new UserModel({ 
			stockListCollection: [ stockListInfo ],
			email,
		})

		user.save(function(err, userID: mongoose.Document){
			if(err) console.error(err);
			console.log('Saved new user of ID', userID._id);
		})
	}

	public static findUserInDatabase(email): Promise<any[]>{
		return new Promise((resolve, reject) => {
			const UserModel = mongoose.model('User', schemas.user);
			UserModel.find({ email }, (err, docs) => {
				if(err) reject(err);
				if(docs === []) reject();
				// Must convert mongoose documents to js objects
				resolve(docs.map(doc => doc.toObject()))
			})
		})
	}

	public static findStockInDatabase(userID): Promise<mongoose.Document>{
		const StockModel = mongoose.model('Stock', schemas.stock);

		return new Promise((resolve, reject) => {
			StockModel.findById(userID, function(err, doc){
				if(err) reject(err);
				resolve(doc.toObject())
			})
		})
	}

	public static findStockListInDatabase(userID): Promise<any>{
		const StockModel = mongoose.model('StockList', schemas.stockList);
		return new Promise((resolve, reject) => {
			StockModel.findById(userID, function(err, doc){
				if(err) reject(err);
				else resolve(doc.toObject())
			})
		})
	}

	public static updateUserStockList(email, stockListInfo){
		Database.findUserInDatabase(email).then(docs => {
			const doc = docs[0];
			
			doc.stockListCollection = doc.stockListCollection.push({stockListInfo});
			doc.save(function(err, updatedDoc){
				if(err) console.error(err);
				console.log('Updated User:', email)
			})
		})
	}

	public static saveStockList(stockList: STOCK_MODEL, email: string, name: string){
		const StockListModel = mongoose.model('StockList', schemas.stockList);
		const list = new StockListModel(stockList);

		list.save(function(err, stockListID: mongoose.Document){
			if(err) console.error(err);
			console.log('Saved new stock list of ID:', stockListID._id)
			const stockListInfo = { stockListID: stockListID._id, name };
			Database.findUserInDatabase(email).then(doc => {
				console.log('Updating user: ', email);
				Database.updateUserStockList(email, stockListInfo);
			}, err => {
				console.log('Saving new user: ', email)
				Database.saveUser(stockListInfo, email)
			})
		})
	}

	public static saveStock(stockObject: any, email: string, name: string){
		/* TODO: must make a time stamp function to call this function once a day to update 
			all present stockData
		*/
		// creating stock model
		const stocks = stockObject.getStockList()
		const StockModel = mongoose.model('Stock', schemas.stock);
		const listOfStockTickers = [];
		// recursively create and save a stock model for each stock
		(function recursive(){
			const stockModel = new StockModel(stocks[0]);

			stockModel.save(function(err, stockID: mongoose.Document) {
				if(err) console.error(err);
				console.log('Saved stock', stocks[0].ticker, stockID._id)
				Database.stockIDCollection.push({ 
					ticker: stocks[0].ticker,
					id: stockID._id
				});
				listOfStockTickers.push(stocks[0].ticker);
				stockObject.shiftStockList()
				if(stocks.length >= 1) recursive();
				else {
					const stockList = { 
						list: listOfStockTickers, 
						name,
						email,
					}
					Database.saveStockList(stockList, email, name);
				}
			})
		}())
	}
}