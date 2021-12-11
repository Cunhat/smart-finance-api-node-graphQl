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
};
