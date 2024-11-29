import { graphqlSync } from 'graphql';
import { schema } from '../schema/schema';

import { startServer, stopServer } from '../index';

beforeAll(async () => {
	await startServer();
})

afterAll(async () => {
	await stopServer();
})
describe('Queries', () => {
	it('getAccount', () => {
		const source = `query FindJosh {
  node(id: "QWNjb3VudDo2NzQ0ZjU0ZTZkZDkwOTVmM2VkNTc4NDQ=") {
    ... on Account {
      id
      balance
      receivedTransactions(first: 1) {
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
      sentTransactions (first: 1) {
        edges{
          node {
            id
            amount
          }
        }
      }
    }
  }
}`;

		expect(graphqlSync({ schema, source })).toStrictEqual({
			data: {
				node: {
					id: "QWNjb3VudDo2NzQ0ZjU0ZTZkZDkwOTVmM2VkNTc4NDQ=",
					balance: "10.00",
					receivedTransactions: {
						edges: [
							{
								node: {
									id: "VHJhbnNhY3Rpb246Njc0OGE3MjFiMjQ4MjBjZDVhZWU3Y2Zi",
									amount: "5.00",
									sender: {
										id: "QWNjb3VudDo2NzQ1MDAxMzgyMThiNTU0NDM3YTk4MTA="
									},
									receiver: {
										id: "QWNjb3VudDo2NzQ0ZjU0ZTZkZDkwOTVmM2VkNTc4NDQ="
									}
								}
							}
						]
					},
					sentTransactions: {
						edges: []
					}
				}
			}
		});
	});
});

