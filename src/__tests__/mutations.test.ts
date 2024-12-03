import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionId, transactionAmount, MOCK_ACCOUNTS, mockTransactionIds } from './utils';
beforeAll(async () => {
	await startServer();
	await populateTestDatabase();
})

afterAll(async () => {
	await stopServer();
})
describe('Mutations', () => {
	it('updateAccount', async () => {
		const deleteId = toGlobalId('Account', mockAccountIds[2]);
		const updateDelete1 = `mutation updateDelete1{
  node(id: "${deleteId}") {
    ... on Account {
      id
      balance
    }
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: updateDelete1 });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({

			node: {
				id: updateDelete1,
				balance: (parseFloat(MOCK_ACCOUNTS[0].balance) - parseFloat(transactionAmount)).toFixed(2),
				receivedTransactions: {
					edges: []
				},
				sentTransactions: {
					edges: [
						{
							node: {
								id: mockTransactionIds[0],
							},
						},
					]
				}
			}

		});
	});
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

