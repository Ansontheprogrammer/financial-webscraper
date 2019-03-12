import mongoose, { mongo } from 'mongoose';
import config from '../config/config';
import { StockList } from './finviz';

type STOCK_LIST = {
	tickerList: string[],
	name: string,
}

const url = config.mongoConnectionKey;

// connecting to mongo and creating schema
mongoose.connect(url, {
	useNewUrlParser: true,
}).then(()=> { console.log('connection to database successful') 
	}, err => console.error(err))

// *******************SCHEMA DECLARATIONS***************************
const Schema = mongoose.Schema;

const stockSchema = new Schema({ 
	userID: String,
	ticker: { type: String, unique: true },
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
} , { autoIndex: false })

const stockListSchema = new Schema({ 
	email: String,
	name: { type: String, unique: true },
	list: [],
}, { autoIndex: false })

const schemas = {
	stock: stockSchema,
	stockList : stockListSchema ,
	user: new Schema({ 
		stockListCollection: [ stockListSchema ],
		email: { type: String, unique: true }
	 }, { autoIndex: false })
}

export const models = {
	UserModel: mongoose.model('User', schemas.user),
	StockModel : mongoose.model('Stock', schemas.stock),
	StockListModel : mongoose.model('StockList', schemas.stockList)
}

const { UserModel, StockModel, StockListModel } = models

export class Database {
	email: string 
	user: {}
	
	constructor(email: string){
		this.email = email;
	}


	public findUserInDatabase(email? : string, noConversion?: boolean): Promise<any>{
		if(!email) email = this.email

		return new Promise((resolve, reject) => {
			UserModel.find({ email }, (err, docs) => {
				if(err) return reject(err);
				if(docs.length === 0) return resolve(null);
				// Must convert mongoose documents to js objects
				noConversion ? resolve(docs) : resolve(docs[0].toObject())
			})
		})
	}

	public static findStockInDatabase(ticker: string): Promise<mongoose.Document>{

		return new Promise((resolve, reject) => {
			StockModel.findOne({ ticker, }, function(err, doc){
				if(err) return reject(err);
				if(!doc) return resolve(null);
				else resolve(doc)
			})
		})
	}

	public findStockListInDatabase(portfolioName: string): Promise<any>{
		const stockData = [];

		return new Promise((resolve, reject) => {
			StockListModel.find({ email: this.email, name: portfolioName }, function(err, docs: any){
				if(err) return reject(err);
				if(!docs.length) return resolve(null);
				docs[0].list.forEach((ticker, index) => Database.findStockInDatabase(ticker).then(stock => {
					stockData.push(stock.toJSON())
					if(index === docs[0].list.length - 1) return resolve(stockData)
				}, reject))
			})
		})
	}

	public updateUserStockList(email: string, stockList: mongoose.Document): Promise<null>{
		// finish check to ensure stock list isn't already created.
		return new Promise((resolve, reject) => {
			this.findUserInDatabase(email, true).then(docs => {
				(docs[0] as any).stockListCollection.push({stockList });
				docs[0].save(function(err, updatedDoc){
					if(err) reject(err);
					resolve();
				})
			}, reject)
		})
	}
	
	public createNewUser(): Promise<null>{
			const user = new UserModel({ 
				stockListCollection: [],
				email: this.email,
			})

		return new Promise((resolve, reject) => {		
			user.save(function(err, userID: mongoose.Document){
				if(err) return reject(err);
				console.log('Saved new user of ID', userID._id);
				return resolve()
			})
		})
	}

	public createNewStockList(stockList: STOCK_LIST): Promise<null>{
		const list = new StockListModel(stockList);

		return new Promise((resolve, reject) => {
			this.findUserInDatabase(this.email, true).then(user => {
				list.save()
				user[0].stockListCollection.push(list);
				user[0].save()
			})
		})
	}
	
	public async storeStocks(userStockList: StockList): Promise<{}>{
		const tickerList = userStockList.getTickerList()
		const stocksNotStoredInDatabase = []
		// iterate through tickerList and push stocks not currently stored.
		for(let i = 0; i <= tickerList.length; i++) {
			const stock = await Database.findStockInDatabase(tickerList[i]) 
			!stock ? stocksNotStoredInDatabase.push(stock) : null
		}
		//
		if(!stocksNotStoredInDatabase.length) return

		return new Promise((resolve, reject) => {
			// recursively create and save a stock model for each stock
			const stockTickersWithIDs = stocksNotStoredInDatabase.map(async function(ticker) {
				const stockModel = new StockModel(ticker);
				try {
					const stockID = await stockModel.save()
					return { 
						ticker,
						id: stockID._id
					}
				 } catch(e) { reject(e) }
			})

			Promise.all(stockTickersWithIDs).then(stockTickers => console.log(stockTickers), reject)
		})
	}	

	public async setUser(){
		try {
			this.user = await this.findUserInDatabase(this.email) 
		} catch(e) { return e }
	}

	public async storeUserAndStockList(userStockList: StockList, email: string, name: string){		
		try {
			// set user if user already created, else no user will be set
			const user = await this.setUser()
			
			// create new user if user not created
			if(!user) await this.createNewUser();

			// store stocks if they are already not stored in database
			await this.storeStocks(userStockList);

			// save user's stock list into database.
			const mongooseStockList = await this.createNewStockList({ tickerList : userStockList.getTickerList(), name });

			// if user is created then update list else create new user
			await this.updateUserStockList(email, mongooseStockList) 
		} catch(e) { return e }
	}
}
