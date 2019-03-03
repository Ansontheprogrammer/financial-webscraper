import mongoose, { mongo } from 'mongoose';
import { StockList } from './finviz';

type STOCK = {
	ticker: string,
	id: string
}

type STOCK_LIST = {
	tickerList: string[],
	name: string,
}

type STOCK_LIST_LOOKUP = {
	stockListID: string,
	name: string
}

const url = `mongodb://Anson:m4cGCRr2lKENVAT7@cluster0-shard-00-00-mqzwm.mongodb.net:27017,cluster0-shard-00-01-mqzwm.mongodb.net:27017,cluster0-shard-00-02-mqzwm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`
// connecting to mongo and creating schema
mongoose.connect(url, {
	useNewUrlParser: true,
}).then(()=> { console.log('connection to database successful') 
	}, err => console.error(err))

// *******************SCHEMA DECLARATIONS***************************
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

const schemas = {
	stock: new Schema(stockSchema, { autoIndex: false }),
	stockList : new Schema({ 
		name: String,
		list: [],
		}, { autoIndex: false }) ,
	user: new Schema({ 
		stockListCollection: [ this.stockList ],
		email: { type: String, unique: true }
	 }, { autoIndex: false })
}

export class Database {
	email: string 
	user: {}

	constructor(email: string){
		this.email = email;
	}

	public findUserInDatabase(email, noConversion?: boolean): Promise<any[]>{
		const UserModel = mongoose.model('User', schemas.user);

		return new Promise((resolve, reject) => {
			UserModel.find({ email }, (err, docs) => {
				if(err) reject(err);
				if(!docs.length) resolve(null);
				// Must convert mongoose documents to js objects
				noConversion ? resolve(docs) : resolve(docs.map(doc => doc.toObject()))
			})
		})
	}

	public findStockInDatabase(ticker: string): Promise<mongoose.Document>{
		const StockModel = mongoose.model('Stock', schemas.stock);

		return new Promise((resolve, reject) => {
			StockModel.findOne({ ticker, }, function(err, doc){
				if(err) reject(err);
				if(!doc) resolve(null);
				else resolve(doc)
			})
		})
	}

	public findStockListInDatabase(email: string, portfolioName: string): Promise<any>{
		const StockModel = mongoose.model('StockList', schemas.stockList);
		const stockData = [];
		const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

		return new Promise((resolve, reject) => {
			StockModel.find({ email, name: portfolioName }, function(err, docs: any){
				if(err) return reject(err);
				if(!docs.length) return reject('Stock list not in database' );
				// NOTE: make it so the only one list can be saved under a portfolio name
				// converting docs[0].list into an unique array before quering
				const uniqueStockList = docs[0].list.filter(onlyUnique);
				uniqueStockList.forEach((ticker, index) => this.findStockInDatabase(ticker).then(stock => {
					stockData.push(stock)
					if(index === uniqueStockList.length) resolve(stockData);
				}))
			})
		})
	}

	public updateUserStockList(email: string, stockList: mongoose.Document): Promise<null>{
		// finish check to ensure stock list isn't already created.
		return new Promise((resolve, reject) => {
			this.findUserInDatabase(email, true).then(docs => {
				if(stockList.toObject())
				(docs[0] as any).stockListCollection.push({stockList});
				docs[0].save(function(err, updatedDoc){
					if(err) reject(err);
					resolve();
				})
			}, reject)
		})
	}
	
	public createNewUser(email: string): Promise<null>{
		const UserModel = mongoose.model('User', schemas.user);
		const user = new UserModel({ 
			stockListCollection: [],
			email,
		})

		return new Promise((resolve, reject) => {		
			user.save(function(err, userID: mongoose.Document){
				if(err) return reject(err);
				console.log('Saved new user of ID', userID._id);
				return resolve()
			})
		})
	}

	public createNewStockList(stockList: STOCK_LIST): Promise<mongoose.Document>{
		const StockListModel = mongoose.model('StockList', schemas.stockList);
		const list = new StockListModel(stockList);

		return new Promise((resolve, reject) => {
			list.save(function(err, stockListDoc: mongoose.Document){
				if(err) reject(err);
				resolve(stockListDoc)
			})
		})
	}
	
	public async storeStocksTemporary(userStockList: StockList): Promise<void>{
		const StockModel = mongoose.model('Stock', schemas.stock);
		const tickerList = userStockList.getTickerList()
		const uniqueTickerList = []

		for(let i = 0; i <= tickerList.length; i++) await !this.findStockInDatabase(tickerList[i]) ? uniqueTickerList.push(tickerList[i]) : null
		
		if(!uniqueTickerList.length) return

		return new Promise((resolve, reject) => {
			// recursively create and save a stock model for each stock
			const stockTickersWithIDs = uniqueTickerList.map(async function(ticker) {
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

	public async storeStockList(userStockList: StockList, email: string, name: string){

		// create stock list model to store in database
		const stockListModel = { 
			tickerList : userStockList.getTickerList(),
			name
		}
		
		try {
			// set user if user already created, else no user will be set
			const user = await this.setUser()
			
			// create new user if user not created
			if(!user) await this.createNewUser(email);

			// store stocks if they are already not stored in database
			await this.storeStocksTemporary(userStockList);

			// save user's stock list into database.
			const mongooseStockList = await this.createNewStockList(stockListModel);

			// if user is created then update list else create new user
			await this.updateUserStockList(email, mongooseStockList) 
		} catch(e) { return e }
	}
}
