import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		amount: {
			type: String,
			description: 'The amount being sent',
		},
		sender: {
			type: ObjectId,
			ref: 'Account',
			description: 'The account sending money',
		},
		receiver: {
			type: ObjectId,
			ref: 'Account',
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
	sender: mongoose.Types.ObjectId;
	receiver: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model('Transaction', TransactionSchema);
