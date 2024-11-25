import { GraphQLObjectType } from 'graphql';

//import { transactionField, transactionConnectionField } from '../modules/transactions/TransactionFields';
//import { accountField } from '../modules/account/AccountField'
import { getAccountQuery } from '../modules/account/queries/getAccountQuery'; // Ensure the import is correct

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		//...transactionConnectionField('getAccountTransactions'),
		getAccount: getAccountQuery,
		//...accountQueries, // "QWNjb3VudDo2NzQ0ZTExYzExNzZiMGVlZDc1ZTg2NmE="
		//...accountField('account'),
		//...transactionField('getTransaction'),
	}),
});
