import { TransactionConnection, TransactionType } from './TransactionType';
import { TransactionLoader } from './TransactionLoader';
import { connectionArgs } from 'graphql-relay';
import { GraphQLID, GraphQLNonNull } from 'graphql';

export const transactionField = (key: string) => ({
	[key]: {
		type: TransactionType,
		args: {
			id: new GraphQLNonNull(GraphQLID),
		},
		resolve: async (obj: Record<string, unknown>, _, context) =>
			TransactionLoader.load(context, obj.message as string),
	},
});

export const transactionConnectionField = (key: string) => ({
	[key]: {
		type: TransactionConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_, args, context) => {
			return await TransactionLoader.loadAll(context, args);
		},
	},
});
