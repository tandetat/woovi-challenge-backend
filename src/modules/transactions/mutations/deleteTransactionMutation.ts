
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
export type deleteTransactionInput = {
	id: string;
};

const _deleteTransactionMutation = mutationWithClientMutationId({
	name: 'deleteTransaction',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	mutateAndGetPayload: async (args: deleteTransactionInput) => {
		const transaction = await Transaction.findByIdAndDelete(getObjectId(args.id));

		return {
			success: transaction !== null,
			id: transaction?._id?.toString() || '',
		};
	},
	outputFields: {
		success: {
			type: GraphQLBoolean,
			resolve: (payload) => payload.success,
		},
		id: {
			type: GraphQLString,
			resolve: (payload) => payload.id,
		},
	},
});

export const deleteTransactionMutation = {
	..._deleteTransactionMutation,
};
