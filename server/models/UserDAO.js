require("../utils/MongooseUtil");
const Models = require("./Models");

const UserDAO = {
  async selectAll() {
    const query = {};
    const users = await Models.User.find(query).exec();
    return users;
  },
  async insert(user) {
    const mongoose = require("mongoose");
    user._id = new mongoose.Types.ObjectId();
    const result = await Models.User.create(user);
    return result;
  },
  async update(user) {
    const newvalues = { name: user.name , major: user.major};
    const result = await Models.User.findByIdAndUpdate(
      user._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.User.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const user = await Models.User.findById(_id).exec();
    return user;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const users = await Models.User.find(query).exec();
    return users;
  },
};
module.exports = UserDAO;
