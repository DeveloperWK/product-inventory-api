import { Request, Response } from "express";

import mongoose from "mongoose";
import CashAccount from "../models/cashAccount";
import Transaction from "../models/Transaction";

const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      res.status(400).json({ message: "Name and type are required" });
      return;
    }

    const newAccount = new CashAccount({
      ...req.body,
      balance: req.body.balance,
    });

    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Account name must be unique" });
      return;
    }
    res
      .status(500)
      .json({ message: "Error creating account", error: error.message });
  }
};

const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, isActive } = req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (isActive) filter.isActive = isActive === "true";

    const accounts = await CashAccount.find(filter).sort({ name: 1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching accounts",
      error: (error as Error).message,
    });
  }
};

const getAccountBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const account = await CashAccount.findById(id);

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.json({
      _id: account._id,
      name: account.name,
      balance: account.balance,
      currency: account.currency,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching balance",
      error: (error as Error).message,
    });
  }
};

const transferFunds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;

    if (!fromAccount || !toAccount || !amount) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "Amount must be positive" });
      return;
    }

    if (fromAccount === toAccount) {
      res.status(400).json({ message: "Cannot transfer to same account" });
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sourceAccount =
        await CashAccount.findById(fromAccount).session(session);
      const targetAccount =
        await CashAccount.findById(toAccount).session(session);

      if (!sourceAccount || !targetAccount) {
        throw new Error("One or both accounts not found");
      }

      if (sourceAccount.balance < amount) {
        throw new Error("Insufficient funds");
      }

      await CashAccount.findByIdAndUpdate(
        fromAccount,
        { $inc: { balance: -amount } },
        { session },
      );

      await CashAccount.findByIdAndUpdate(
        toAccount,
        { $inc: { balance: amount } },
        { session },
      );

      const transferOut = new Transaction({
        type: "transfer",
        category: "funds_transfer",
        amount,
        paymentMethod: "transfer",
        description: description || `Transfer to ${targetAccount.name}`,
        cashAccount: fromAccount,
        isRecurring: false,
      });

      const transferIn = new Transaction({
        type: "transfer",
        category: "funds_transfer",
        amount,
        paymentMethod: "transfer",
        description: description || `Transfer from ${sourceAccount.name}`,
        cashAccount: toAccount,
        isRecurring: false,
      });

      await transferOut.save({ session });
      await transferIn.save({ session });

      await session.commitTransaction();

      res.json({
        message: "Transfer completed successfully",
        newSourceBalance: sourceAccount.balance - amount,
        newTargetBalance: targetAccount.balance + amount,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error transferring funds",
      error: (error as Error).message,
    });
  }
};
export { createAccount, getAccountBalance, getAccounts, transferFunds };
