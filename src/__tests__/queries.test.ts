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
		const { _sender, _transaction } = { _sender: mockAccountIds[0].toString(), _transaction: mockTransactionIds[0].toString() };
		const senderId = toGlobalId('Account', _sender);
		const transactionId = toGlobalId('Transaction', _transaction);
		const findSender = `query FindSender{
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
      sentTransactions (last: 10) {
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
			.send({ query: findSender });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data.node.id).toBe(senderId);
		expect(response.body.data.node.balance).toMatch((parseFloat(MOCK_ACCOUNTS[0].balance) - total).toFixed(2));
		expect(response.body.data.node.receivedTransactions.edges).toBe([]);
		expect(response.body.data.node.sentTransactions.edges).toContainEqual(
			{
				node: {
					id: transactionId,
				},
			}
		);
	});
	it('getTransaction', async () => {
		const { _sender, _receiver, _transaction, } = {
			_sender: mockAccountIds[0].toString(),
			_receiver: mockAccountIds[1].toString(),
			_transaction: mockAccountIds[1].toString()
		};
		const amount = transactionAmounts[0].toFixed(2);
		const transactionId = toGlobalId('Transaction', _transaction);
		const senderId = toGlobalId('Account', _sender);
		const receiverId = toGlobalId('Account', _receiver);
		const findTransaction = `query FindTransaction1{
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
			.send({ query: findTransaction });
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({
			node: {
				id: transactionId,
				amount,
				sender: { id: senderId, name: 'Sender' },

				receiver: { id: receiverId, name: 'Receiver' },
			}

		});
	});
	it('getTransactions', async () => {
		const { _sender, _receiver } = { _sender: mockAccountIds[0].toString(), _receiver: mockAccountIds[1].toString() };
		const senderId = toGlobalId('Account', _sender);
		const receiverId = toGlobalId('Account', _receiver);

		const transactionIds = mockTransactionIds.map((id) => toGlobalId('Transaction', id.toString()));
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
		expect(response.body.data.getTransactions.edges).toContainEqual({
			node: {

				id: transactionIds[1],
				amount: transactionAmounts[1].toFixed(2),
				sender: { id: senderId },

				receiver: { id: receiverId },
			}
		}
		);
		expect(response.body.data.getTransactions.edges).toContainEqual({
			node: {
				id: transactionIds[0],
				amount: transactionAmounts[0].toFixed(2),
				sender: { id: senderId },

				receiver: { id: receiverId },
			}


		})
	});

});

