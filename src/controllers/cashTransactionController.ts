import { Request, Response } from "express";
import mongoose from "mongoose";
import CashAccount from "../models/cashAccount";
import Transaction, { ITransaction } from "../models/Transaction";

const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      category,
      amount,
      paymentMethod,
      cashAccount,
      transactionId,
    } = req.body;

    if (
      !type ||
      !category ||
      !amount ||
      !paymentMethod ||
      !cashAccount ||
      !transactionId
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "Amount must be positive" });
      return;
    }

    const newTransaction: ITransaction = new Transaction({
      ...req.body,
      date: req.body.date || new Date().toISOString(),
    });

    const account = await CashAccount.findById(cashAccount);
    if (!account) {
      res.status(404).json({ message: "Cash account not found" });
      return;
    }

    const amountToUpdate = type === "income" ? amount : -amount;
    const newBalance = account.balance + amountToUpdate;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const savedTransaction = await newTransaction.save({ session });

      await CashAccount.findByIdAndUpdate(
        cashAccount,
        { balance: newBalance },
        { new: true, session }
      );

      await session.commitTransaction();
      res.status(201).json(savedTransaction);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error creating transaction",
      error: (error as Error).message,
    });
  }
};

const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, startDate, endDate, category, minAmount, maxAmount } =
      req.query;
    const filter: any = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const transactions = await Transaction.find(filter)
      .populate("cashAccount", "-_id name")
      .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
      error: (error as Error).message,
    });
  }
};

const getCashFlowSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const match: any = {};

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate as string);
      if (endDate) match.date.$lte = new Date(endDate as string);
    }

    const summary = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Error generating cash flow summary",
      error: (error as Error).message,
    });
  }
};

const getTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("relatedInventory")
      .populate("relatedOrder")
      .populate("cashAccount");

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transaction",
      error: (error as Error).message,
    });
  }
};

const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount, type, cashAccount } = req.body;
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (
        amount !== undefined ||
        type !== undefined ||
        cashAccount !== undefined
      ) {
        const oldAccount = await CashAccount.findById(transaction.cashAccount);
        const newAccount = cashAccount
          ? await CashAccount.findById(cashAccount)
          : oldAccount;

        if (!oldAccount || !newAccount) {
          res.status(404).json({ message: "Cash account not found" });
          return;
        }

        const oldAmountEffect =
          transaction.type === "income"
            ? -transaction.amount
            : transaction.amount;

        const newType = type || transaction.type;
        const newAmount = amount || transaction.amount;
        const newAmountEffect = newType === "income" ? newAmount : -newAmount;

        if (
          (oldAccount._id as mongoose.Types.ObjectId).toString() !==
          (newAccount._id as mongoose.Types.ObjectId).toString()
        ) {
          await CashAccount.findByIdAndUpdate(
            oldAccount._id,
            { $inc: { balance: oldAmountEffect } },
            { session }
          );
        }

        await CashAccount.findByIdAndUpdate(
          newAccount._id,
          {
            $inc: {
              balance:
                (oldAccount._id as mongoose.Types.ObjectId).toString() ===
                (newAccount._id as mongoose.Types.ObjectId).toString()
                  ? oldAmountEffect + newAmountEffect
                  : newAmountEffect,
            },
          },
          { session }
        );
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, session }
      );

      await session.commitTransaction();
      res.json(updatedTransaction);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating transaction",
      error: (error as Error).message,
    });
  }
};

const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const amountEffect =
        transaction.type === "income"
          ? -transaction.amount
          : transaction.amount;

      await CashAccount.findByIdAndUpdate(
        transaction.cashAccount,
        { $inc: { balance: amountEffect } },
        { session }
      );

      await Transaction.findByIdAndDelete(req.params.id, { session });
      await session.commitTransaction();

      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({
      message: "Error deleting transaction",
      error: (error as Error).message,
    });
  }
};
export {
  createTransaction,
  deleteTransaction,
  getCashFlowSummary,
  getTransaction,
  getTransactions,
  updateTransaction,
};
