
import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Account } from '../AccountModel';

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
		const account = await Account.findByIdAndDelete(args.id).exec();

		//redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
		//	message: message._id.toString(),
		//});
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
			type: GraphQLString,
			resolve: (payload) => payload.id,
		},
	},
});

export const deleteAccountMutation = {
	..._deleteAccountMutation,
};
