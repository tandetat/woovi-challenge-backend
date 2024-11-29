import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../TransactionFields';
import { syncBalance } from '../../account/AcountUtils';

import { getObjectId } from '@entria/graphql-mongo-helpers';
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
		const options = { new: false };
		const transaction = (await Transaction.findByIdAndUpdate(getObjectId(args.id), update, options).exec())!;

		const diff: number = parseFloat(args.amount) - parseFloat(transaction.amount);

		await syncBalance(transaction.sender, -diff);
		await syncBalance(transaction.receiver, diff);


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
