import { startServer, stopServer } from '../index';
import { Account } from '../modules/account/AccountModel';
import { syncBalance } from '../modules/account/AcountUtils';
import { Transaction } from '../modules/transactions/TransactionModel';
import { app } from '../server/app';
import request from 'supertest';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { toGlobalId } from 'graphql-relay';
const MOCK_ACCOUNTS = [{ name: 'Sender 1', balance: '100.00' }, { name: 'Receiver 1', balance: '10.00' }, { name: 'Delete 1', balance: '10.00' }];
let mockAccountIds: string[];
let mockTransactionIds: string[];
async function populateTestDatabase() {
	mockAccountIds = await Promise.all(MOCK_ACCOUNTS.map(async (value) => {
		const account = await new Account(value).save();

		return account._id.toString();
	}));
	const sender = mockAccountIds[0];
	const receiver = mockAccountIds[1];
	const amount = '20.00';
	const transaction = await new Transaction({ sender, receiver, amount }).save();
	mockTransactionIds = [transaction._id.toString()];
	await syncBalance(getObjectId(sender)!, -parseFloat(amount));
	await syncBalance(getObjectId(receiver)!, parseFloat(amount));
}
beforeAll(async () => {
	await startServer();
	await populateTestDatabase();
})

afterAll(async () => {
	await stopServer();
})
describe('Queries', () => {
	it('getAccount', async () => {
		const senderId = toGlobalId('Account', mockAccountIds[0]);
		const transactionId = toGlobalId('Transaction', mockTransactionIds[0]);
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
      sentTransactions (first: 1) {
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
		console.log(response);
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(response.body.data).toStrictEqual({

			node: {
				id: senderId,
				balance: "80.00",
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
});

