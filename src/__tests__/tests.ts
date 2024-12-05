import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
import { toGlobalId } from 'graphql-relay';
import { populateTestDatabase, mockAccountIds, mockTransactionIds, transactionAmounts, MOCK_ACCOUNTS, total } from './utils';
import { clearTestDatabase } from './utils';
import { Account } from '../modules/account/AccountModel';
import { Transaction } from '../modules/transactions/TransactionModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';

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
		expect(response.body.data.node.receivedTransactions.edges).toStrictEqual([]);
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
			_transaction: mockTransactionIds[0].toString()
		};
		const amount = transactionAmounts[0];
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
		expect(response.headers['content-type']).toMatch('application/json; charset=utf-8');
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
  getTransactions(last: 10) {
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
		expect(response.headers['content-type']).toMatch('application/json; charset=utf-8');
		expect(response.body.data.getTransactions.edges).toContainEqual({
			node: {

				id: transactionIds[1],
				amount: transactionAmounts[1],
				sender: { id: senderId },

				receiver: { id: receiverId },
			}
		}
		);
		expect(response.body.data.getTransactions.edges).toContainEqual({
			node: {
				id: transactionIds[0],
				amount: transactionAmounts[0],
				sender: { id: senderId },

				receiver: { id: receiverId },
			}


		})
	});

});

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
		expect(response.headers['content-type']).toMatch('application/json; charset=utf-8');
		expect(response.body.data.createAccount.account.balance).toStrictEqual(
			newBalance
		);
		expect(response.body.data.createAccount.account.name).toMatch(name);
		const id = getObjectId(response.body.data.createAccount.account.id)!;

		// check db for new account
		const newAccDb = await Account.findById(id).exec();
		expect(newAccDb).toBeTruthy();
		expect(newAccDb!.balance).toMatch(newBalance);
		expect(newAccDb!.name).toMatch(name);
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
		expect(response.headers['content-type']).toMatch('application/json; charset=utf-8');
		expect(response.body.data.updateAccount).toStrictEqual({
			account: {
				id: updateId,
				balance: newBalance,
			}
		});
		const updatedAcc = await Account.findById(_updId).exec();
		expect(updatedAcc).toBeTruthy();
		expect(updatedAcc!.balance).toMatch(newBalance);

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
		expect(newTransaction).toBeTruthy();
		expect(newTransaction!.amount).toStrictEqual(amount);
		expect(newTransaction!.sender.toString()).toMatch(_sender);
		expect(newTransaction!.receiver.toString()).toMatch(_receiver);

	});
	it('updateTransaction', async () => {
		const _id = mockTransactionIds[1];
		const updateId = toGlobalId('Transaction', _id.toString());
		const amount = "0.70";
		const updateTransactionMut = `mutation UpdateTransaction {
  updateTransaction(
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
		expect(updatedTransaction).toBeTruthy();
		expect(updatedTransaction!.amount).toMatch(amount);
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

