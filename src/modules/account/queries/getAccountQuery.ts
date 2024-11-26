import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

import { Account } from '../AccountModel';
import { AccountType } from '../AccountType';
import { AccountLoader } from '../AccountLoader';
import { getObjectId } from '@entria/graphql-mongo-helpers';
export type getAccountInput = {
	id: string;
};

export const getAccountQuery = {
	type: AccountType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	resolve: async (_, args, context) => AccountLoader.load(context, args.id),

};

