import { Types } from 'mongoose';
import { Account } from '../modules/account/AccountModel';
import { syncBalance } from '../modules/account/AcountUtils';
import { Transaction } from '../modules/transactions/TransactionModel';
import { config } from './config';

const MOCK_ACCOUNTS = [{ name: 'Sender', balance: '100.00' }, { name: 'Receiver', balance: '10.00' }, { name: 'Update', balance: '0.00' }, { name: 'Delete', balance: '10.00' }];
const mockAccountIds: Types.ObjectId[] = [];
const transactionAmounts: string[] = [];
const mockTransactionIds: Types.ObjectId[] = [];
let total: number = 0;
async function populateTestDatabase() {

	// add accounts to db
	mockAccountIds.push(...await Promise.all(MOCK_ACCOUNTS.map(async (value): Promise<Types.ObjectId> => {
		const account = await new Account(value).save();

		return account._id;
	})));
	const sender = mockAccountIds[0];
	const receiver = mockAccountIds[1];
	// get a random amounts based on sender's balance and push them to transactionAmounts
	// truncate amounts to two digits
	const len: number = 3;
	transactionAmounts.push(...Array.from({ length: len }, () => (Math.random() * parseFloat(MOCK_ACCOUNTS[0].balance) / len).toFixed(2)));

	// add transactions to db
	mockTransactionIds.push(...await Promise.all(transactionAmounts.map(async (amount): Promise<Types.ObjectId> => {
		const transaction = await new Transaction({ sender, receiver, amount }).save()!;

		return transaction._id;
	})));

	// get the total from all transactions and update the accounts' balances in the db
	total = parseFloat(transactionAmounts.reduce((previous, current) => (parseFloat(previous) + parseFloat(current)).toFixed(2)));
	await syncBalance(sender!, -total);
	await syncBalance(receiver!, total);
}
async function clearTestDatabase() {
	console.log(config.TEST);
	if (config.TEST) {
		const ac = await Account.collection.drop();
		const tr = await Transaction.collection.drop();

		if (!ac) { throw new Error('Failed to drop Accounts collection') }
		if (!tr) { throw new Error('Failed to drop Transactions collection') }
		mockAccountIds.length = 0;
		mockTransactionIds.length = 0;
		transactionAmounts.length = 0;
		total = 0;
	} else {
		throw new Error('Attempted to wipe prod database.');
	}
}

export { MOCK_ACCOUNTS, mockTransactionIds, mockAccountIds, populateTestDatabase, transactionAmounts, total, clearTestDatabase };
