import { Transaction } from "../transactions/TransactionModel";
import { deleteTransaction } from "../transactions/TransactionUtils";
import { Account } from "./AccountModel";
import { Types } from "mongoose";

export async function syncBalance(id: Types.ObjectId, amount: number): Promise<void> {

	const account = await Account.findById(id).exec();

	const update = { balance: (parseFloat(account!.balance!) + amount).toFixed(2) };

	if (await Account.findByIdAndUpdate(id, update).exec() === null) {
		return Promise.reject(Error(`Error: failed to update balance for account ${id}`));
	}

	return Promise.resolve();
}

export async function deleteAccountTransactions(id: Types.ObjectId): Promise<void> {
	const transactions = await Transaction.find({
		$or: [
			{ sender: id },
			{ receiver: id },
		],
	}).exec();

	if (transactions === null) { return Promise.resolve(); }

	// Sync other accounts' balances
	transactions.forEach(async (transaction) => {
		const amount = parseFloat(transaction.amount);
		if (transaction.sender.equals(id)) {
			await syncBalance(transaction.receiver, -amount);
		}
		if (transaction.receiver.equals(id)) {
			await syncBalance(transaction.sender, amount);
		}

	})
	const result = await Transaction.deleteMany({
		$or: [
			{ sender: id },
			{ receiver: id },
		],
	}).exec();
	return result !== null ? Promise.resolve() : Promise.reject();
}
