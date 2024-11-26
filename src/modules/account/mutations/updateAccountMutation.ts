import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { Account } from '../AccountModel';
import { accountField } from '../AccountField';

export type updateAccountInput = {
	id: string;
	balance: string;
};

const _updateAccountMutation = mutationWithClientMutationId({
	name: 'updateAccount',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
		balance: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: updateAccountInput) => {
		const update = { balance: args.balance };
		// get the modified document
		const options = { new: true };
		const account = await Account.findByIdAndUpdate(getObjectId(args.id), update, options).exec();

		return {
			account: account!._id.toString(),
		};
	},
	outputFields: {
		...accountField('account'),
	},
});

export const updateAccountMutation = {
	..._updateAccountMutation,
};
