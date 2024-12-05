import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionIds, transactionAmounts, MOCK_ACCOUNTS } from './utils';
import { Account } from '../modules/account/AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { Transaction } from '../modules/transactions/TransactionModel';
import { clearTestDatabase } from '../database';
beforeAll(async () => {
	await startServer();
	await clearTestDatabase();
	await populateTestDatabase();
})

afterAll(async () => {
	await clearTestDatabase();
	await stopServer();
})
describe('Mutations', () => {
	it('createAccount', async () => {
		const newBalance = "50.00";
		const name = 'New Account';
		const createAccount = `mutation updateDelete1{
createAccount(
    input: { name: "${name}" balance: "${newBalance}"}
  ) {
    account {
      id
      name 
      balance
    }
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: createAccount });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.createAccount.account.balance).toStrictEqual(
			newBalance
		);
		expect(response.body.data.createAccount.account.name).toStrictEqual(name);
		const id = response.body.data.createAccount.account.id;
		const newAccDb = await Account.findById(getObjectId(id)).exec();
		expect(newAccDb?.balance).toStrictEqual(newBalance);
		expect(newAccDb?.name).toStrictEqual(name);
		expect(newAccDb?.id).toStrictEqual(id);
	});
	it('updateAccount', async () => {
		const _updId = mockAccountIds[2];
		const updateId = toGlobalId('Account', _updId.toString());
		const newBalance = (20.00 + parseFloat(MOCK_ACCOUNTS[2].balance)).toFixed(2);
		const updateAccMut = `mutation updateDelete1{
updateAccount(
    input: {id: "${updateId}", balance: "${newBalance}"}
  ) {
    account {
      id
      balance
    }
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: updateAccMut });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.updateAccount).toStrictEqual({
			account: {
				id: updateId,
				balance: newBalance,
			}
		});
		const updatedAcc = await Account.findById(_updId).exec();
		expect(updatedAcc?.balance).toStrictEqual(newBalance);
		expect(updatedAcc?.id).toStrictEqual(updateId);

	});
	it('deleteAccount', async () => {
		const _id = mockAccountIds[3];
		const deleteId = toGlobalId('Account', _id.toString());
		const deleteAccMut = `mutation delete{
deleteAccount(
    input: {id: "${deleteId}" }
  ) {
    success
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: deleteAccMut });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.deleteAccount).toStrictEqual({
			success: true,
		});
		const deletedAcc = await Account.findById(_id).exec();
		expect(deletedAcc).toBeNull();
	});
	it('createTransaction', async () => {
		const _sender = mockAccountIds[0].toString();
		const _receiver = mockAccountIds[1].toString();
		const senderId = toGlobalId('Account', _sender);
		const receiverId = toGlobalId('Account', _receiver);
		const amount = "1.00";
		const createTransaction = `mutation createTransaction{
createTransaction(
    input: {sender: "${senderId}", receiver: "${receiverId}", amount: "${amount}"}
  ) {
    transaction {
      id
      sender {
        id
      }
      receiver {
        id
      }
      amount
    }
  }
  }`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: createTransaction });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.createTransaction.transaction.sender.id).toStrictEqual(senderId);
		expect(response.body.data.createTransaction.transaction.receiver.id).toStrictEqual(receiverId);
		expect(response.body.data.createTransaction.transaction.amount).toStrictEqual(amount);

		const id = getObjectId(response.body.data.createTransaction.transaction.id);
		const newTransaction = await Transaction.findById(id).exec();
		expect(newTransaction?.amount).toStrictEqual(amount);
		expect(newTransaction?.sender).toStrictEqual(senderId);
		expect(newTransaction?.receiver).toStrictEqual(receiverId);

	});
	it('updateTransaction', async () => {
		const _id = mockTransactionIds[1];
		const updateId = toGlobalId('Transaction', _id.toString());
		const amount = "0.70";
		const updateTransactionMut = `mutation updateTransaction{
updateteTransaction(
    input: {id: "${updateId}", amount: "${amount}"}
  ) {
    transaction {
      id
      amount
    }
  }
  }`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: updateTransactionMut });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.updateTransaction).toStrictEqual({
			transaction: {
				id: updateId,
				amount: amount,
			}
		});
		const updatedTransaction = await Transaction.findById(_id).exec();
		expect(updatedTransaction?.amount).toStrictEqual(amount);
	});
	it('deleteTransaction', async () => {
		const _id = mockTransactionIds[2];
		const deleteId = toGlobalId('Transaction', _id.toString());
		const deleteTransactionMut = `mutation delete{
deleteTransaction(
    input: {id: "${deleteId}" }
  ) {
    success
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: deleteTransactionMut });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.deleteTransaction).toStrictEqual({
			success: true,
		});
		const deletedTransaction = await Transaction.findById(_id).exec();
		expect(deletedTransaction).toBeNull();
	});
});

