
import { GraphQLNonNull, GraphQLID, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Account } from '../AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
export type deleteAccountInput = {
	id: string;
};

const _deleteAccountMutation = mutationWithClientMutationId({
	name: 'deleteAccount',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	mutateAndGetPayload: async (args: deleteAccountInput) => {
		const account = await Account.findByIdAndDelete(getObjectId(args.id)).exec();

		return {
			success: account !== null,
			id: account?._id?.toString() || '',
		};
	},
	outputFields: {
		success: {
			type: GraphQLBoolean,
			resolve: (payload) => payload.success,
		},
		id: {
			type: GraphQLID,
			resolve: (payload) => payload.id,
		},
	},
});

export const deleteAccountMutation = {
	..._deleteAccountMutation,
};
