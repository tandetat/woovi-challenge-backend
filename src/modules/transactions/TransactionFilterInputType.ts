import { GraphQLID, GraphQLInputObjectType } from 'graphql';

import { FILTER_CONDITION_TYPE, getObjectId } from '@entria/graphql-mongo-helpers';


export const transactionFilterMapping = {
	sender: {
		type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
		format: (val: string) => val && getObjectId(val),
	},
};

const TransactionFilterInputType = new GraphQLInputObjectType({
	name: 'TransactionFilter',
	description: 'Used to filter transactions',
	fields: () => ({
		sender: {
			type: GraphQLID,
		},
	}),
});

export default TransactionFilterInputType;
