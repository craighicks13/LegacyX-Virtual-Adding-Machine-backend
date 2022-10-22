import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {
	console.log(process.env.MONGO_USERNAME);

	const client = new MongoClient(
		`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.plvljia.mongodb.net/?retryWrites=true&w=majority`
	);
	await client.connect();
	db = client.db('simple-ledger-db');
	cb();
}

export { db, connectToDb };
