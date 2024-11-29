import { graphql } from 'graphql';
import { schema } from '../schema/schema';

import { startServer, stopServer } from '../index';

beforeAll(async () => {
	await startServer();
})

afterAll(async () => {
	await stopServer();
})
describe('Queries', () => {
	it('getAccount', async () => {
		const source = `query FindJosh {
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
		const response = await graphql({ schema, source });
		expect(response).toStrictEqual({
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

