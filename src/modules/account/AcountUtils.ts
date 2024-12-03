import { Account } from "./AccountModel";
import { Types } from "mongoose";
export async function syncBalance(id: Types.ObjectId, amount: number): Promise<void> {

	const account = await Account.findById(id).exec();

	const update = { balance: (parseFloat(account?.balance!) + amount).toFixed(2) };

	if (await Account.findByIdAndUpdate(id, update).exec() === null) {
		return Promise.reject(Error(`Error: failed to update balance for account ${id}`));
	}

	return Promise.resolve();
}
