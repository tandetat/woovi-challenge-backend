import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { Account } from '../AccountModel';
import { accountField } from '../AccountField';

export type createAccountInput = {
	name: string;
	balance: string;
};

const _createAccountMutation = mutationWithClientMutationId({
	name: 'createAccount',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		balance: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: createAccountInput) => {
		const account = await new Account(args).save()!;

		return {
			account: account._id.toString(),
		};
	},
	outputFields: {
		...accountField('account'),
	},
});

export const createAccountMutation = {
	..._createAccountMutation,
};
