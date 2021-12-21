const Category = require("../../models/category");
const User = require("../../models/user");
const { userId, categoryImp } = require("./utils");

module.exports = {
  category: async () => {
    try {
      const categories = await Category.find();
      return categories.map((category) => {
        return categoryImp(category);
      });
    } catch (error) {
      throw error;
    }
  },
  createCategory: async (args) => {
    try {
      const newCategory = new Category({
        name: args.categoryInput.name,
        user: userId, //It will be changed when we add authentication
      });
      const checkIfExists = await Category.findOne({
        name: args.categoryInput.name,
      });
      if (checkIfExists) {
        throw new Error("Category already exists");
      }
      let createCategory;
      const newCategoryObj = await newCategory.save();
      createCategory = categoryImp(newCategoryObj);
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
  updateCategory: async (args) => {
    try {
      const { id, ...category } = args.updateCategoryInput;
      await Category.findByIdAndUpdate(id, {
        name: category.name,
      });

      return { _id: id, name: category.name };
    } catch (error) {
      throw error;
    }
  },
};
