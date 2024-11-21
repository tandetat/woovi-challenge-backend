import { createTransactionMutation } from './createTransactionMutation';
import { updateTransactionMutation } from './updateTransactionMutation';
import { deleteTransactionMutation } from './deleteTransactionMutation';

export const transactionMutations = {
	createTransaction: createTransactionMutation,
	updateTransaction: updateTransactionMutation,
	deleteTransaction: deleteTransactionMutation,
};
