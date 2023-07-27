require("../utils/MongooseUtil");
const Models = require("./Models");

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async insert(admin) {
    const mongoose = require("mongoose");
    admin._id = new mongoose.Types.ObjectId();
    const result = await Models.Admin.create(admin);
    return result;
  },
  async selectByUsername(username) {
    const admin = await Models.Admin.findOne({ username });
    return admin;
  },
};
module.exports = AdminDAO;
