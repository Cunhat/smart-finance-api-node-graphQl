const { categoriesPopulate, subCategoriesPopulate } = require("./utils");
const User = require("../../models/user");
const userId = "61afe0c235a584291c4c2e80";
const bcrypt = require("bcryptjs");

module.exports = {
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
};
