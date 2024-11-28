import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';
import { Account } from '../../account/AccountModel';
import { getObjectId } from '@entria/graphql-mongo-helpers';

import mongoose from 'mongoose';

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
			sender: getObjectId(args.sender),
			receiver: getObjectId(args.receiver),
			amount: args.amount,
		}).save();
		if (transaction === null || transaction === undefined) {
			throw Error('could not save new transaction\n');
		}

		//const senderUpdate = { $push: { sentTransactions: transaction._id } };
		//const receiverUpdate = { $push: { receivedTransactions: transaction._id } };
		//
		//if (!mongoose.Types.ObjectId.isValid(args.sender)) {
		//	throw Error(`failed to convert sender.id to ObjectId ${args.sender}`);
		//}
		//const senderId = getObjectId(args.sender);
		//
		//if (!mongoose.Types.ObjectId.isValid((args.receiver))) {
		//	throw Error(`failed to convert receiver.id to ObjectId ${args.receiver}`);
		//}
		//const receiverId = getObjectId(args.receiver);
		//
		//await Account.findByIdAndUpdate(senderId, senderUpdate).exec();
		//await Account.findByIdAndUpdate(receiverId, receiverUpdate).exec();

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
