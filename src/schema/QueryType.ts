import { GraphQLObjectType } from 'graphql';

//import { transactionField, transactionConnectionField } from '../modules/transactions/TransactionFields';
import { accountField } from '../modules/account/AccountField'

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		//...transactionConnectionField('getAccountTransactions'),
		...accountField('getAccount'),
		//...transactionField('getTransaction'),
	}),
});
