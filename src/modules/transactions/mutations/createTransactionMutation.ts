import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';

export type createTransactionInput = {
	senderId: string;
	receiverId: string;
	amount: string;
};
const _createTransactionMutation = mutationWithClientMutationId({
	name: 'createTransaction',
	inputFields: {
		senderId: {
			type: new GraphQLNonNull(GraphQLID),
		},
		receiverId: {
			type: new GraphQLNonNull(GraphQLID),
		},
		amount: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: createTransactionInput) => {
		const transaction = await new Transaction({
			senderId: args.senderId,
			receiverId: args.receiverId,
			amount: args.amount,
		}).save();

		//redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
		//	message: message._id.toString(),
		//});

		return {
			transaction: transaction._id.toString(),
		};
	},
	outputFields: {
		...transactionField('transaction'),
	},
});

export const createTransactionMutation = {
	..._createTransactionMutation,
};
