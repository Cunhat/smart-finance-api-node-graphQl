const User = require("../../models/user");
const SubCategory = require("../../models/subCategory");
const Category = require("../../models/category");
const Transaction = require("../../models/transaction");

const userId = "61afe0c235a584291c4c2e80";

const subCategoriesPopulate = async (subCategoryId) => {
  const subCategories = await SubCategory.find({ _id: { $in: subCategoryId } });
  return subCategories.map((subCategory) => {
    return {
      ...subCategory._doc,
      _id: subCategory._id,
      user: () => userPopulate(subCategory.user),
    };
  });
};

const categoriesPopulate = async (categoryId) => {
  const categories = await Category.find({ _id: { $in: categoryId } });
  return categories.map((category) => {
    const obj = {
      ...category._doc,
      _id: category._id,
      user: () => userPopulate(category.user),
    };

    return obj;
  });
};

const transactionPopulate = async (transactionId) => {
  const transactions = await Transaction.find({ _id: { $in: transactionId } });
  return transactions.map((transaction) => {
    const obj = {
      ...transaction._doc,
      _id: transaction._id,
      user: () => userPopulate(transaction.user),
    };

    return obj;
  });
};

const userPopulate = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user._doc !== null) {
      return {
        ...user._doc,
        _id: user.id,
        categories: () => categoriesPopulate(user._doc.categories),
        subCategories: () => subCategoriesPopulate(user._doc.subCategories),
      };
    }
  } catch (error) {
    throw error;
  }
};

const categoryImp = (category) => {
  return {
    ...category._doc,
    _id: category.id.toString(),
    user: () => userPopulate(category.user._id),
  };
};

const subCategoryImp = (subCategory) => {
  return {
    ...subCategory._doc,
    _id: subCategory.id.toString(),
    user: () => userPopulate(subCategory.user._id),
  };
};

const transactionImp = async (transaction) => {
  const user = await userPopulate(transaction.user._id);
  const category = await categoriesPopulate(transaction.category._id);
  const subCategory = await subCategoriesPopulate(transaction.subCategory);

  return {
    ...transaction._doc,
    _id: transaction.id.toString(),
    user: user,
    category: category[0],
    subCategory: subCategory[0],
  };
};

exports.userPopulate = userPopulate;
exports.categoriesPopulate = categoriesPopulate;
exports.subCategoriesPopulate = subCategoriesPopulate;
exports.transactionPopulate = transactionPopulate;
exports.userId = userId;
exports.categoryImp = categoryImp;
exports.subCategoryImp = subCategoryImp;
exports.transactionImp = transactionImp;
