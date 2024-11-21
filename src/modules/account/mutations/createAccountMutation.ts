import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

//import { redisPubSub } from '../../pubSub/redisPubSub';
//import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

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

		//redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
		//	message: message._id.toString(),
		//});
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
