import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import { ITransaction } from './TransactionModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './TransactionLoader';

const TransactionType = new GraphQLObjectType<ITransaction>({
	name: 'Transaction',
	description: 'Represents an account',
	fields: () => ({
		id: globalIdField('Transaction'),
		amount: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: (transaction) => transaction.amount,
		},
		sender: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (transaction) => transaction.sender,
		},
		receiver: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (transaction) => transaction.receiver,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (message) => message.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
	name: 'Transaction',
	nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
