import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionIds, transactionAmounts, MOCK_ACCOUNTS } from './utils';
import { Account } from '../modules/account/AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { AccountLoader } from '../modules/account/AccountLoader';
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
		expect(response.body.data.balance).toStrictEqual(
			newBalance
		);
		expect(response.body.data.name).toStrictEqual(name);
		const id = response.body.data.id;
		const newAccDb = await Account.findById(getObjectId(id)).exec();
		expect(newAccDb?.balance).toStrictEqual(newBalance);
		expect(newAccDb?.name).toStrictEqual(name);
		expect(newAccDb?.id).toStrictEqual(getObjectId(id));
	});
	it('updateAccount', async () => {
		const deleteId = toGlobalId('Account', mockAccountIds[2]);
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
			id: deleteId,
			balance: newBalance,
		});
		const updatedAcc = await Account.findById(getObjectId(deleteId)).exec();
		expect(updatedAcc?.balance).toStrictEqual(newBalance);
		expect(updatedAcc?.id).toStrictEqual(getObjectId(deleteId));

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
	})
	it('getTransaction', async () => {
		const transactionId = toGlobalId('Transaction', mockTransactionId);
		const senderId = toGlobalId('Account', mockAccountIds[0]);
		const receiverId = toGlobalId('Account', mockAccountIds[1]);
		const findTransaction1 = `query FindTransaction1{
  node(id: "${transactionId}") {
    ... on Transaction{
      id
      amount 
      sender {
        id
        name
      }
      receiver {
        id
        name
      }
  }
 }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: findTransaction1 });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({
			node: {
				id: transactionId,
				amount: transactionAmount,
				sender: { id: senderId, name: 'Sender 1' },

				receiver: { id: receiverId, name: 'Receiver 1' },
			}

		});
	});

});

