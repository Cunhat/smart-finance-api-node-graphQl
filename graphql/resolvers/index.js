const bcrypt = require("bcryptjs");
const Category = require("../../models/category");
const User = require("../../models/user");
const SubCategory = require("../../models/subCategory");
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

module.exports = {
  category: async () => {
    try {
      const categories = await Category.find();
      return categories.map((category) => {
        return {
          ...category._doc,
          _id: category.id.toString(),
          user: () => userPopulate(category.user._id),
        };
      });
    } catch (error) {
      throw err;
    }
  },
  createCategory: async (args) => {
    try {
      const newCategory = new Category({
        name: args.categoryInput.name,
        user: userId, //It will be changed when we add authentication
      });
      let createCategory;
      const newCategoryObj = await newCategory.save();
      createCategory = {
        ...newCategoryObj._doc,
        _id: newCategoryObj.id.toString(),
        user: () => userPopulate(newCategoryObj._doc.user),
      };
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User doesnt exist");
      }
      user.categories.push(createCategory);
      user.save();
      return createCategory;
    } catch (error) {
      throw error;
    }
  },
  user: async () => {
    try {
      const results = await User.find();
      return results.map((user) => {
        return {
          ...user._doc,
          password: "",
          _id: user.id.toString(),
          categories: () => categoriesPopulate(user._doc.categories),
          subCategories: () => subCategoriesPopulate(user._doc.subCategories),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        name: args.userInput.name,
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        password: "",
        _id: result.id.toString(),
      };
    } catch (err) {
      throw err;
    }
  },
  subCategory: async () => {
    try {
      const subCategories = await SubCategory.find();
      return subCategories.map((subCategory) => {
        return {
          ...subCategory._doc,
          _id: subCategory.id.toString(),
          user: () => userPopulate(subCategory.user._id),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  createSubCategory: async (args) => {
    try {
      const newSubCategory = new SubCategory({
        name: args.subCategoryInput.name,
        user: userId, //It will be changed when we add authentication
      });
      let createSubCategory;
      const newSubCategoryObj = await newSubCategory.save();
      createSubCategory = {
        ...newSubCategoryObj._doc,
        _id: newSubCategoryObj.id.toString(),
        user: () => userPopulate(newSubCategoryObj._doc.user),
      };
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User doesnt exist");
      }
      user.subCategories.push(createSubCategory);
      user.save();
      return createSubCategory;
    } catch (error) {
      throw error;
    }
  },
};
