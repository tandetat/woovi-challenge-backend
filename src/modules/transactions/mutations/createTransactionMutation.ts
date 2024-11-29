import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';
import { getObjectId } from '@entria/graphql-mongo-helpers';
import { syncBalance } from '../../account/AcountUtils';

export type createTransactionInput = {
	sender: string;
	receiver: string;
	amount: string;
};
const _createTransactionMutation = mutationWithClientMutationId({
	name: 'createTransaction',
	inputFields: {
		sender: {
			type: new GraphQLNonNull(GraphQLID),
		},
		receiver: {
			type: new GraphQLNonNull(GraphQLID),
		},
		amount: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: createTransactionInput) => {
		const _sender = getObjectId(args.sender)!;
		const _receiver = getObjectId(args.receiver)!;
		const transaction = await new Transaction({
			sender: _sender,
			receiver: _receiver,
			amount: args.amount,
		}).save()!;
		await syncBalance(_sender, -parseFloat(args.amount));
		await syncBalance(_receiver, parseFloat(args.amount));

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
