import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

import { Account } from '../AccountModel';
import { AccountType } from '../AccountType';
import { AccountLoader } from '../AccountLoader';
import { getObjectId } from '@entria/graphql-mongo-helpers';
export type getAccountInput = {
	id: string;
};

const _getAccountQuery = {
	type: AccountType,
	args: {
		name: { type: new GraphQLNonNull(GraphQLString) },
	},
	resolve: async (_, args, context) => {

		const account = await Account.findOne({ name: args.name }).exec();
		if (account === null || account === undefined) {
			throw Error(`account not found for id ${args.name}`)
		}
		console.log(account.get('balance'));
		AccountLoader.load(context, account._id as string);
	}
};
export const getAccountQuery = {
	..._getAccountQuery,
};
