import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionIds, transactionAmounts, MOCK_ACCOUNTS, total } from './utils';
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
describe('Queries', () => {
	it('getAccount', async () => {
		const { _sender, _transaction } = { _sender: mockAccountIds[0], _transaction: mockAccountIds[1] };
		const senderId = toGlobalId('Account', _sender);
		const transactionId = toGlobalId('Transaction', _transaction);
		const findSender1 = `query FindSender1{
  node(id: "${senderId}") {
    ... on Account {
      id
      balance
      receivedTransactions(first: 1) {
        edges {
          node {
            id
          }
        }
      }
      sentTransactions (last: 1) {
        edges{
          node {
            id
          }
        }
      }
    }
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: findSender1 });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({

			node: {
				id: senderId,
				balance: (parseFloat(MOCK_ACCOUNTS[0].balance) - total).toFixed(2),
				receivedTransactions: {
					edges: []
				},
				sentTransactions: {
					edges: [
						{
							node: {
								id: transactionId,
							},
						},
					]
				}
			}

		});
	});
	it('getTransaction', async () => {
		const { _sender, _receiver, _transaction, } = { _sender: mockAccountIds[0], _receiver: mockAccountIds[1], _transaction: mockAccountIds[1] };
		const amount = transactionAmounts[0].toFixed(2);
		const transactionId = toGlobalId('Transaction', _transaction);
		const senderId = toGlobalId('Account', _sender);
		const receiverId = toGlobalId('Account', _receiver);
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
				amount,
				sender: { id: senderId, name: 'Sender 1' },

				receiver: { id: receiverId, name: 'Receiver 1' },
			}

		});
	});
	it('getTransactions', async () => {
		const { _sender, _receiver } = { _sender: mockAccountIds[0], _receiver: mockAccountIds[1] };
		const senderId = toGlobalId('Account', _sender);
		const receiverId = toGlobalId('Account', _receiver);

		const transactionIds = mockTransactionIds.map((id) => toGlobalId('Transaction', id));
		const findTransactions = `query getTransactions {
  getTransactions(last: 2) {
    edges {
      node {
        id
        amount
        sender {
          id
        }
        receiver {
          id
        }
      }
    }
  }
}`;
		const response = await request(app.callback())
			.post('/graphql')
			.set('Content-Type', 'application/json')
			.send({ query: findTransactions });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.edges).toContainEqual({
			node: {

				id: transactionIds[1],
				amount: transactionAmounts[1].toFixed(2),
				sender: { id: senderId },

				receiver: { id: receiverId },
			}
		}
		);
		expect(response.body.data.edges).toContainEqual({
			node: {
				id: transactionIds[0],
				amount: transactionAmounts[0].toFixed(2),
				sender: { id: senderId },

				receiver: { id: receiverId },
			}


		})
	});

});

