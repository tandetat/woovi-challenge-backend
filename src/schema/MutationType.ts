import { GraphQLObjectType } from 'graphql';

import { accountMutations } from '../modules/account/mutations/accountMutations'
//import { transactionMutations } from '../modules/transactions//mutations/transactionMutations'
export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...accountMutations,
		//...transactionMutations,
	}),
});
