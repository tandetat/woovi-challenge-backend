import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '../loader/loaderRegister';

import { Transaction } from './TransactionModel';
import { transactionFilterMapping } from './TransactionFilterInputType';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: Transaction,
	loaderName: 'TransactionLoader',
	filterMapping: transactionFilterMapping,
});

registerLoader('TransactionLoader', getLoader);

export const TransactionLoader = {
	Transaction: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
