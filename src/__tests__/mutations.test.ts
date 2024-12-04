import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionIds, transactionAmounts, MOCK_ACCOUNTS } from './utils';
import { Account } from '../modules/account/AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { Transaction } from '../modules/transactions/TransactionModel';
beforeAll(async () => {
	await startServer();
	await populateTestDatabase();
})

afterAll(async () => {
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
			.send({ mutation: createAccount });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.account.balance).toStrictEqual(
			newBalance
		);
		expect(response.body.data.account.name).toStrictEqual(name);
		const id = response.body.data.account.id;
		const newAccDb = await Account.findById(getObjectId(id)).exec();
		expect(newAccDb?.balance).toStrictEqual(newBalance);
		expect(newAccDb?.name).toStrictEqual(name);
		expect(newAccDb?.id).toStrictEqual(getObjectId(id));
	});
	it('updateAccount', async () => {
		const _delId = mockAccountIds[2];
		const deleteId = toGlobalId('Account', _delId);
		const newBalance = "20.00";
		const updateDelete1 = `mutation updateDelete1{
updateAccount(
    input: {id: "${deleteId}", balance: "${newBalance}"}
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
			.send({ mutation: updateDelete1 });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({
			account: {
				id: deleteId,
				balance: newBalance,
			}
		});
		const updatedAcc = await Account.findById(_delId).exec();
		expect(updatedAcc?.balance).toStrictEqual(newBalance);
		expect(updatedAcc?.id).toStrictEqual(_delId);

	});
	it('deleteAccount', async () => {
		const deleteId = toGlobalId('Account', mockAccountIds[2]);
		const deleteAcc = `mutation delete{
deleteAccount(
    input: {id: "${deleteId}" }
  ) {
    success
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ mutation: deleteAcc });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({
			success: true,
		});
		const deletedAcc = await Account.findById(getObjectId(deleteId)).exec();
		expect(deletedAcc).toBeNull();
	});
	it('createTransaction', async () => {
		const _sender = mockAccountIds[0];
		const _receiver = mockAccountIds[1];
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
			.send({ mutation: createTransaction });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.transaction.sender.id).toStrictEqual(senderId);
		expect(response.body.data.transaction.receiver.id).toStrictEqual(receiverId);
		expect(response.body.data.transaction.amount).toStrictEqual(amount);

		const id = response.body.data.transaction.id;
		const newTransaction = await Transaction.findById(getObjectId(id)).exec();
		expect(newTransaction?.amount).toStrictEqual(amount);
		expect(newTransaction?.sender).toStrictEqual(_sender);
		expect(newTransaction?.receiver).toStrictEqual(_receiver);

	});
	it('updateTransaction', async () => {
		const _id = mockTransactionIds[0]
		const updateId = toGlobalId('Account', _id);
		const amount = "0.70";
		const updateTransaction = `mutation updateTransaction{
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
			.send({ mutation: updateTransaction });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({
			transaction: {
				id: updateId,
				amount: amount,
			}
		});
		const updatedTransaction = await Transaction.findById(getObjectId(updateId)).exec();
		expect(newTransaction?.amount).toStrictEqual(amount);
		expect(newTransaction?.sender).toStrictEqual(getObjectId(senderId));
		expect(newTransaction?.receiver).toStrictEqual(getObjectId(receiverId));

	})

});

