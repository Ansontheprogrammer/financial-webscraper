import mongoose from 'mongoose';
import { STOCK_MODEL, StockList } from './finviz';

type STOCK = {
	ticker: string,
	id: string
}

type STOCK_LIST = {
	list: string[],
	name: string,
	email: string,
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

export class Database {
	public stockIDCollection: STOCK[] = [];

	public findUserInDatabase(email, noConversion?: boolean): Promise<any[]>{

		return new Promise((resolve, reject) => {
			const UserModel = mongoose.model('User', schemas.user);
			UserModel.find({ email }, (err, docs) => {
				if(err) reject(err);
				if(!docs.length) reject('No user was found');
				// Must convert mongoose documents to js objects
				noConversion ? resolve(docs) : resolve(docs.map(doc => doc.toObject()))
			})
		})
	}

	public findStockInDatabase(ticker): Promise<mongoose.Document>{
		const StockModel = mongoose.model('Stock', schemas.stock);

		return new Promise((resolve, reject) => {
			StockModel.findOne({ ticker, }, function(err, doc){
				if(err) reject(err);
				if(!doc) reject('Stock not in database');
				else resolve(doc)
			})
		})
	}

	public findStockListInDatabase(email: string, portfolioName: string): Promise<any>{
		const StockModel = mongoose.model('StockList', schemas.stockList);
		let count = 0;
		const stockData = [];
		const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

		return new Promise((resolve, reject) => {
			StockModel.find({ email, name: portfolioName }, function(err, docs: any){
				if(err) return reject(err);
				if(!docs.length) return reject('Stock list not in database' );
				// NOTE: make it so the only one list can be saved under a portfolio name
				// converting docs[0].list into an unique array before quering
				const uniqueStockList = docs[0].list.filter(onlyUnique);
				uniqueStockList.forEach(ticker => new Database().findStockInDatabase(ticker).then(stock => {
					stockData.push(stock)
					count++ 
					if(count === uniqueStockList.length) resolve(stockData);
				}))
			})
		})
	}

	public updateUserStockList(email: string, stockListLookup: STOCK_LIST_LOOKUP): Promise<null>{
		
		return new Promise((resolve, reject) => {
			new Database().findUserInDatabase(email, true).then(docs => {
				const doc = docs[0];
				(doc as any).stockListCollection.push({stockListLookup});
				doc.save(function(err, updatedDoc){
					if(err) reject(err);
					resolve();
				})
			}, reject)
		})
	}
	
	public saveUser(stockListLookup:STOCK_LIST_LOOKUP, email: string): Promise<null>{

		return new Promise(async function(resolve, reject){
			const UserModel = mongoose.model('User', schemas.user);
			const user = new UserModel({ 
				stockListCollection: [ stockListLookup ],
				email,
			})

			// Look through database to see if user is created already
			let isUserInDatabase = false;

			try {
				isUserInDatabase = !!await new Database().findUserInDatabase(email)
			} catch(e) { console.log('Creating new user') }
			
			if(isUserInDatabase) reject('User already created')
			
			user.save(function(err, userID: mongoose.Document){
				if(err) return reject(err);
				console.log('Saved new user of ID', userID._id);
				return resolve()
			})
		})
	}

	public saveStockList(stockList: STOCK_MODEL, email: string, name: string): Promise<{update: boolean, stockListLookup: STOCK_LIST_LOOKUP}>{
		return new Promise((resolve, reject) => {
			const StockListModel = mongoose.model('StockList', schemas.stockList);
			const list = new StockListModel(stockList);

			list.save(function(err, stockListID: mongoose.Document){
				if(err) reject(err);
				console.log('Saved new stock list of ID:', stockListID._id)
				const stockListLookup: STOCK_LIST_LOOKUP= { stockListID: (stockListID._id as string), name };
				new Database().findUserInDatabase(email).then(doc => {
			    	doc.length ? resolve({update: true, stockListLookup}) : resolve({update: false, stockListLookup})
				}).catch(err => reject(err))
			})
		})
	}
	
	public saveStock(userStockList: StockList, email: string, name: string, res): Promise<any>{
		/* TODO: must make a time stamp function to call new Database() function once a day to update 
			all present stockData
		*/
		return new Promise((resolve, reject) => {
			const stocks = userStockList.getStockList()
			const StockModel = mongoose.model('Stock', schemas.stock);
			const listOfStockTickers: string[] = [];
			// recursively create and save a stock model for each stock
			(function recursive(){
				const stockModel = new StockModel(stocks[0]);
				stockModel.save(function(err, stockID: mongoose.Document) {
					if(err) reject(err);
					console.log('Saved stock', stocks[0].ticker, stockID._id)
					new Database().stockIDCollection.push({ 
						ticker: stocks[0].ticker,
						id: stockID._id
					});
					listOfStockTickers.push(stocks[0].ticker);
					userStockList.shiftStockList()
					if(stocks.length >= 1) recursive();
					else {
						const stockList = { 
							list: listOfStockTickers, 
							name,
							email,
						}
						new Database().storingDataFlow(stockList, email, name).then(() => {
							res.sendStatus(200)
						})
					}
				})
			}())
		})
	}
	
	private async storingDataFlow(stockList: STOCK_LIST, email: string, name: string){
		try {
			const saveOrUpdate = await new Database().saveStockList(stockList, email, name);
			if(saveOrUpdate.update){
				console.log('Updating user: ', email);
				await new Database().updateUserStockList(email, saveOrUpdate.stockListLookup)
			} else {
				console.log('Saving new user: ', email)
				await new Database().saveUser(saveOrUpdate.stockListLookup, email)
			}
			return Promise.resolve();
		} catch(err) { Promise.reject(err) }
	}
}
