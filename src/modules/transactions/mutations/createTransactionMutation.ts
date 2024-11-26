import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';
import { Account } from '../../account/AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';
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
		const transaction = await new Transaction({
			sender: args.sender,
			receiver: args.receiver,
			amount: args.amount,
		}).save();
		if (transaction === null || transaction === undefined) {
			throw Error('could not save new transaction\n');
		}

		const update = { $push: { transactions: transaction._id } };
		await Account.findByIdAndUpdate(getObjectId(args.sender), update).exec();
		await Account.findByIdAndUpdate(getObjectId(args.receiver), update).exec();

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
