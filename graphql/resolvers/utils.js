const User = require("../../models/user");
const SubCategory = require("../../models/subCategory");
const Category = require("../../models/category");

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
    return {
      ...category._doc,
      _id: category._id,
      user: () => userPopulate(category.user),
    };
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

exports.userPopulate = userPopulate;
exports.categoriesPopulate = categoriesPopulate;
exports.subCategoriesPopulate = subCategoriesPopulate;
exports.userId = userId;
exports.categoryImp = categoryImp;
exports.subCategoryImp = subCategoryImp;
