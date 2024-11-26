import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { Account } from '../AccountModel';
import { accountField } from '../AccountField';

export type createAccountInput = {
	name: string;
	initialDeposit: string;
};

const _createAccountMutation = mutationWithClientMutationId({
	name: 'createAccount',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		initialDeposit: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: createAccountInput) => {
		const account = await new Account({
			name: args.name,
			balance: args.initialDeposit,
		}).save();

		if (account === null || account === undefined) {
			throw Error('could not save account\n');
		}
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
