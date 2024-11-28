import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { IAccount } from './AccountModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';
import { TransactionConnection } from '../transactions/TransactionType';
import { TransactionLoader } from '../transactions/TransactionLoader';
import {
	connectionArgs,
	withFilter,
} from '@entria/graphql-mongo-helpers';
const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents an account',
	fields: () => ({
		id: globalIdField('Account'),
		balance: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (account) => account.balance,
		},
		receivedTransactions: {
			type: new GraphQLList(new GraphQLNonNull(TransactionConnection.connectionType)),
			args: {
				...connectionArgs,
			},
			resolve: (account, args, context) => TransactionLoader.loadAll(context, withFilter(args, { receiver: account._id })),
		},
		senderTransactions: {
			type: new GraphQLList(new GraphQLNonNull(TransactionConnection.connectionType)),
			args: {
				...connectionArgs,
			},
			resolve: (account, args, context) => TransactionLoader.loadAll(context, withFilter(args, { sender: account._id })),
		},
		createdAt: {
			type: GraphQLString,
			resolve: (account) => account.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType };
