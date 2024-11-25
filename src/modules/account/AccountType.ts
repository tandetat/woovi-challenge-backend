import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInputObjectType, GraphQLID } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { IAccount } from './AccountModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';

const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents an account',
	fields: () => ({
		id: globalIdField('Account'),
		balance: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (account) => account.balance,
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (account) => account.name,
		},
		transactions: {
			type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
			resolve: (account) => account.transactions,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (account) => account.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

//const AccountInputType = new GraphQLInputObjectType({
//	name: 'AccountInput',
//	fields: {
//		id: { type: new GraphQLNonNull(GraphQLID) },
//	},
//});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType };
