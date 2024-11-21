import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
//import { redisPubSub } from '../../pubSub/redisPubSub';
//import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

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
		const account = await Account.findByIdAndUpdate(args.id, update, options);

		//redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
		//	message: message._id.toString(),
		//});

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
