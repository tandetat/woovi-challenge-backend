import { AccountType } from './AccountType';
import { AccountLoader } from './AccountLoader';
import { GraphQLID, GraphQLNonNull } from 'graphql';

export const accountField = (key: string) => ({
	[key]: {
		type: AccountType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			AccountLoader.load(context, obj.account as string),
	},
});

