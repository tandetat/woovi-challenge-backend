import mongoose from 'mongoose';

import { config } from './config';
import { Account } from './modules/account/AccountModel';
import { Transaction } from './modules/transactions/TransactionModel';

async function connectDatabase() {
	// eslint-disable-next-line

	mongoose.connection.on('close', () =>
		console.log('Database connection closed.')
	);

	await mongoose.connect(config.MONGO_URI);
}

async function disconnectDatabase() {
	await mongoose.disconnect();
}
async function clearTestDatabase() {
	if (config.TEST) {
		Account.collection.drop();
		Transaction.collection.drop();
	} else {
		throw new Error('Attempted to wipe prod database.');
	}
}
export { connectDatabase, disconnectDatabase, clearTestDatabase };
