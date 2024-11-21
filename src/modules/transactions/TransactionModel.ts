import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		amount: {
			type: String,
			description: 'The amount being sent',
		},
		sender: {
			type: String,
			description: 'The account sending money',
		},
		receiver: {
			type: String,
			description: 'The account receiving the money',
		},
	},
	{
		collection: 'Transaction',
		timestamps: true,
	}
);

export type ITransaction = {
	amount: string;
	sender: string;
	receiver: string;
	transactions: string[];
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model('Transaction', TransactionSchema);
