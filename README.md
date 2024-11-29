# Woovi Challenge: Bank CRUD Backend

Based on boilerplate [Woovi Playground](https://github.com/woovibr/woovi-playground) and [Relay Workshop](https://github.com/sibelius/relay-workshop).

## Currently working parts

- get Account with balance, received Transactions, and sent Transactions
- get Transactions
- create new Account
- update new Account
- create New Transaction

## Is partially implemented and/or has not been tested

- Delete Account or Transaction
- Update Transaction

## Still needs to be implemented

- Keep Account balance up to date based on Transactions
- Tests
- Deployment
- Possibly a User type

## Design and Decisions

We must implement a backend that replicates a bank, where you can send and receive a transaction, and calculate the available balance of an account. 

We have two related entities, Account and Transaction, and we must make considerations about them.

An Account must be able to send and receive transactions, and we must be able to calculate its available balance. A Transaction must inform to which Account it is being sent to and which Account sent it, and also inform the amount being traded.

There are two main design questions we need to think about:

1. What is the best way to record and calculate the available balance of an Account?
2. What is the best way to store Transactions?

### First Issue

I can think of two approaches to handle the first issue: one is to keep an available balance field inside the Account; the other is to calculate the available balance whenever it is requested from the transactions involving this Account.

#### First Approach

##### Pros

- Breaks up the calculation of the available balance by updating the value every time a Transaction involving the Account is created, updated, or deleted.
- Fast and easy access since it is just a field inside the Account type, O(1) access time (in theory)

##### Cons

- Needs to be updated every time a Transaction involving the Account is created, updated, or deleted so that it remains up-to-date.

#### Second Approach

##### Pros

- Does not need to be constantly updated, since it calculates the value when needed.

##### Cons

- Expensive to access since calculating the value involves adding up all Transactions involving the Account, O(n) operations where n is the number of Transactions involving the Account.

#### Solution

So, which rate is greater: the rate in which our users try to check their balance or the rate in which transactions involving them are created, updated, or deleted?

From personal experience, I believe most people check their bank accounts more often than transactions are created, updated, or deleted from their accounts. 

Thus, we need to ensure that Accounts have cheap and fast access to their available balance and use the first approach.

### Second Issue

Now, should we store Transactions separately from the Accounts or store the Transactions involving each Account inside said Account?

#### First Approach

##### Pros

- The schema is less coupled and nested
- Reduce graph cycling.
- Querying for specific Transactions is only a table/array lookup

##### Cons

- Querying the Transactions from an Account is a search/filter operation
- Needs logic to keep available balance up-to-date on Mutation code

#### Second Approach

##### Pros

- Querying Transactions from an Account is simply querying for the value of a field of an Account
- Makes it easier to keep available balance up-to-date, since it only needs to listen to its accountTransactions field

##### Cons

- Create duplicate Transactions (one in sender Account and one in receiver Account)

#### Solution

Even though the first approach has downsides, the second approach has a fatal flaw: duplicating Transactions. Duplicating Transactions create an array of problems, such as:

- Updating one Transaction will involve updating two entries in the database
- The database will need to keep both copies synced always for consistency
- Every Transaction will need double the amount of space to be stored

Therefore, I prefer the first approach.
