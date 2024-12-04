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
	console.log(config.TEST);
	if (config.TEST) {
		const ac = await Account.collection.drop();
		const tr = await Transaction.collection.drop();

		if (!ac) { throw new Error('Failed to drop Accounts collection') }
		if (!tr) { throw new Error('Failed to drop Transactions collection') }
	} else {
		throw new Error('Attempted to wipe prod database.');
	}
}
export { connectDatabase, disconnectDatabase, clearTestDatabase };
