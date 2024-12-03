import { Account } from '../modules/account/AccountModel';
import { syncBalance } from '../modules/account/AcountUtils';
import { Transaction } from '../modules/transactions/TransactionModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
const MOCK_ACCOUNTS = [{ name: 'Sender 1', balance: '100.00' }, { name: 'Receiver 1', balance: '10.00' }, { name: 'Delete 1', balance: '10.00' }];
const mockAccountIds: string[] = [];
const transactionAmounts: number[] = [];
const mockTransactionIds: string[] = [];
let total: number;
async function populateTestDatabase() {

	// add accounts to db
	mockAccountIds.push(...await Promise.all(MOCK_ACCOUNTS.map(async (value): Promise<string> => {
		const account = await new Account(value).save();

		return account._id.toString();
	})));
	const sender = mockAccountIds[0];
	const receiver = mockAccountIds[1];
	// get a random amounts based on sender's balance and push them to transactionAmounts
	// truncate amounts to two digits
	const len: number = 2;
	transactionAmounts.push(...Array.from({ length: len }, () => parseFloat((Math.random() * parseFloat(MOCK_ACCOUNTS[0].balance) / len).toFixed(2))));

	// add transactions to db
	mockTransactionIds.push(...await Promise.all(transactionAmounts.map(async (amount): Promise<string> => {
		const transaction = await new Transaction({ sender, receiver, amount }).save()!;

		return transaction._id.toString();
	})));

	// get the total from all transactions and update the accounts' balances in the db
	total = transactionAmounts.reduce((previous, current) => previous + current);
	await syncBalance(getObjectId(sender)!, -total);
	await syncBalance(getObjectId(receiver)!, total);
}

export { MOCK_ACCOUNTS, mockTransactionIds, mockAccountIds, populateTestDatabase, transactionAmounts, total };
