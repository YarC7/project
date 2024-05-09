require("../utils/MongooseUtil");
const Models = require("./Models");

const UsedDAO = {
  async selectAll() {
    const query = {};
    const useds = await Models.Used.find(query).exec();
    return useds;
  },
  async insert(used) {
    const mongoose = require("mongoose");
    used._id = new mongoose.Types.ObjectId();
    const result = await Models.Used.create(used);
    return result;
  },
  async update(used) {
    const newvalues = { user: used.user , product: used.product, classes: used.classes ,period: used.period,time: used.time, purpose: used.purpose, des: used.des};
    const result = await Models.Used.findByIdAndUpdate(
      used._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Used.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const used = await Models.Used.findById(_id).exec();
    return used;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const useds = await Models.Used.find(query).exec();
    return useds;
  },
};
module.exports = UsedDAO;
