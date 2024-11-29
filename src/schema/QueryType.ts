import { GraphQLObjectType } from 'graphql';

import { transactionField, transactionConnectionField } from '../modules/transactions/TransactionFields';
//import { accountField } from '../modules/account/AccountField'
//import { getAccountQuery } from '../modules/account/queries/getAccountQuery'; // Ensure the import is correct
import { nodeField, nodesField } from '../modules/node/typeRegister';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		...transactionConnectionField('getTransactions'),
		//getAccount: getAccountQuery,
		node: nodeField,
		nodes: nodesField,
		getAccount: nodeField,
		//...accountQueries, // "QWNjb3VudDo2NzQ0ZTExYzExNzZiMGVlZDc1ZTg2NmE="
		//...accountField('account'),
		//...transactionField('getTransaction'),
	}),
});
