import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema<IAccount>(
	{
		balance: {
			type: String,
			description: 'The available balance of the account',
		},
		name: {
			type: String,
			description: 'The name of the account',
		},
	},
	{
		collection: 'Account',
		timestamps: true,
	}
);

export type IAccount = {
	balance: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Account: Model<IAccount> = mongoose.model('Account', AccountSchema);
