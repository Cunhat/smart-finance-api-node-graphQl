const bcrypt = require("bcryptjs");
const Category = require("../../models/category");
const User = require("../../models/user");
const SubCategory = require("../../models/subCategory");
const Transaction = require("../../models/transaction");

const userId = "61a68fccb954bb6bd486a57a";

const categoriesPopulate = (categoryId) => {
  return Category.find({ _id: { $in: categoryId } })
    .then((categories) => {
      return categories.map((category) => {
        return {
          ...category._doc,
          _id: category._id,
          user: userPopulate(category.userF),
        };
      });
    })
    .catch((err) => {
      throw err;
    });
};

const userPopulate = (userId) => {
  return User.findById(userId).then((user) => {
    if (user) {
      return {
        ...user._doc,
        _id: user.id,
        categories: categoriesPopulate(user._doc.categories),
      };
    }
  });
};

module.exports = {
  category: async () => {
    try {
      const categories = await Category.find();
      return categories.map((category) => {
        return {
          ...category._doc,
          _id: category.id.toString(),
          user: userPopulate(category.user._id),
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
        user: userPopulate(newCategoryObj._doc.user),
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
          categories: categoriesPopulate(user._doc.categories),
        };
      });
    } catch (error) {
      throw err;
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
};
