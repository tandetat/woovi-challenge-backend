export interface DataLoaders {
	AccountLoader: ReturnType<typeof import('../account/AccountLoader').AccountLoader.getLoader>;
	TransactionLoader: ReturnType<typeof import('../transactions/TransactionLoader').TransactionLoader.getLoader>;
	//UserLoader: ReturnType<typeof import('../user/UserLoader').UserLoader.getLoader>;
}

const loaders: {
	[Name in keyof DataLoaders]: () => DataLoaders[Name];
} = {} as any;

const registerLoader = <Name extends keyof DataLoaders>(key: Name, getLoader: () => DataLoaders[Name]) => {
	loaders[key] = getLoader as any;
};

const getDataloaders = (): DataLoaders =>
	(Object.keys(loaders) as (keyof DataLoaders)[]).reduce(
		(prev, loaderKey) => ({
			...prev,
			[loaderKey]: loaders[loaderKey](),
		}),
		{},
	) as any;

export { registerLoader, getDataloaders };
