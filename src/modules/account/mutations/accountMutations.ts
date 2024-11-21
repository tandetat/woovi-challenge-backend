import { createAccountMutation } from './createAccountMutation';
import { updateAccountMutation } from './updateAccountMutation';
import { deleteAccountMutation } from './deleteAccountMutation';

export const accountMutations = {
	createAccount: createAccountMutation,
	updateAccount: updateAccountMutation,
	deleteAccount: deleteAccountMutation,
};
