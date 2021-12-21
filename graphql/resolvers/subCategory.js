const SubCategory = require("../../models/subCategory");
const User = require("../../models/user");
const { subCategoryImp, userId } = require("./utils");

module.exports = {
  subCategory: async () => {
    try {
      const subCategories = await SubCategory.find();
      return subCategories.map((subCategory) => {
        return subCategoryImp(subCategory);
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
      const checkIfExists = await SubCategory.findOne({
        name: args.subCategoryInput.name,
      });
      if (checkIfExists) {
        throw new Error("SubCategory already exists");
      }
      let createSubCategory;
      const newSubCategoryObj = await newSubCategory.save();
      createSubCategory = subCategoryImp(newSubCategoryObj);
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
  updateSubCategory: async (args) => {
    try {
      const { id, ...subCategory } = args.updateSubCategoryInput;
      await SubCategory.findByIdAndUpdate(id, {
        name: subCategory.name,
      });

      return { _id: id, name: subCategory.name };
    } catch (error) {
      throw error;
    }
  },
};
