import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
//import { redisPubSub } from '../../pubSub/redisPubSub';
//import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';

export type updateTransactionInput = {
	id: string;
	amount: string;
};

const _updateTransactionMutation = mutationWithClientMutationId({
	name: 'updateTransaction',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
		amount: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: updateTransactionInput) => {
		const update = { amount: args.amount };
		// get the modified document
		const options = { new: true };
		const transaction = await Transaction.findByIdAndUpdate(args.id, update, options);

		//redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
		//	message: message._id.toString(),
		//});

		return {
			transaction: transaction!._id.toString(),
		};
	},
	outputFields: {
		...transactionField('transaction'),
	},
});

export const updateTransactionMutation = {
	..._updateTransactionMutation,
};
