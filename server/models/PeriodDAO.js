require("../utils/MongooseUtil");
const Models = require("./Models");

const PeriodDAO = {
  async selectAll() {
    const query = {};
    const period = await Models.Period.find(query).exec();
    return period;
  },
  async insert(period) {
    const mongoose = require("mongoose");
    period._id = new mongoose.Types.ObjectId();
    const result = await Models.Period.create(period);
    return result;
  },
  async selectByID(_id) {
    const period = await Models.Period.findById(_id).exec();
    return period;
  },
  async update(period) {
    const newvalues = {
      index: period.index,
      from: period.from,
      to: period.to,
    };
    const result = await Models.Period.findByIdAndUpdate(
      period._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Period.findByIdAndRemove(_id);
    return result;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const period = await Models.Period.find(query).exec();
    return period;
  },
};
module.exports = PeriodDAO;
