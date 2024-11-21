import { AccountType } from './AccountType';
import { AccountInputType } from './AccountType'; // Import the new input type
import { AccountLoader } from './AccountLoader';
import { GraphQLID, GraphQLNonNull } from 'graphql';

export const accountField = (key: string) => ({
	[key]: {
		type: AccountType,
		//args: {
		//	id: { type: new GraphQLNonNull(GraphQLID) }, // Use the input type
		//},
		resolve: async (obj: Record<string, unknown>, { input }, context) =>
			AccountLoader.load(context, input.id), // Access the id from the input
	},
});
