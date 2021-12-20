const Transaction = require("../../models/transaction");
const Category = require("../../models/category");
const SubCategory = require("../../models/subCategory");
const User = require("../../models/user");
const { userId, transactionImp } = require("./utils");

module.exports = {
  transaction: async () => {
    try {
      const transactions = await Transaction.find();
      return transactions.map((transaction) => {
        return transactionImp(transaction);
      });
    } catch (error) {
      throw error;
    }
  },

  createTransaction: async (args) => {
    try {
      const category = await Category.findOne({
        _id: args.transactionInput.category,
      });
      const subCategory = await SubCategory.findOne({
        _id: args.transactionInput.subCategory,
      });

      //const user = await User.findById(userId);

      const newTransaction = new Transaction({
        name: args.transactionInput.name,
        value: args.transactionInput.value,
        user: userId, //It will be changed when we add authentication, //It will be changed when we add authentication
        category: category,
        subCategory: subCategory,
        date: new Date(args.transactionInput.date),
      });

      let createTransaction;
      const newTransactionObj = await newTransaction.save();
      //console.log(newTransactionObj);
      createTransaction = await transactionImp(newTransactionObj);
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User doesnt exist");
      }
      console.log(user);
      user.transactions.push(createTransaction);
      user.save();

      return createTransaction;
    } catch (error) {
      throw error;
    }
  },
};
