require("../utils/MongooseUtil");
const Models = require("./Models");

const BillDAO = {
  async selectAll() {
    const query = {};
    const bill = await Models.Bill.find(query).exec();
    return bill;
  },
  async insert(bill) {
    const mongoose = require("mongoose");
    bill._id = new mongoose.Types.ObjectId();
    const result = await Models.Bill.create(bill);
    return result;
  },
  async selectByID(_id) {
    const bill = await Models.Bill.findById(_id).exec();
    return bill;
  },
  async update(bill) {
    const newvalues = {
      producer : bill.producer,
      code : bill.code,
      quantities : bill.quantities,
      tprice : bill.tprice,
      prices : bill.prices,
      cdate : bill.cdate,
      // year : bill.year,
    };
    const result = await Models.Bill.findByIdAndUpdate(
      bill._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Bill.findByIdAndRemove(_id);
    return result;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const bill = await Models.Bill.find(query).exec();
    return bill;
  },
};
module.exports = BillDAO;
