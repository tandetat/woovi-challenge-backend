import { schema } from '../schema/schema';
import { startServer, stopServer } from '../index';
import { app } from '../server/app';
import request from 'supertest';
beforeAll(async () => {
	await startServer();
})

afterAll(async () => {
	await stopServer();
})
describe('Queries', () => {
	it('getAccount', async () => {
		const query = `query FindJosh {
  node(id: "QWNjb3VudDo2NzRhMDgwYzFhOGZjNWNjZjgzYjgxNzQ=") {
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
			.send({ query: query });
		expect(response.body).toStrictEqual({
			data: {
				node: {
					id: "QWNjb3VudDo2NzRhMDgwYzFhOGZjNWNjZjgzYjgxNzQ=",
					balance: "10.00",
					receivedTransactions: {
						edges: []
					},
					sentTransactions: {
						edges: []
					}
				}
			}
		});
	});
});

