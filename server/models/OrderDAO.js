require("../utils/MongooseUtil");
const Models = require("./Models");

const OrderDAO = {
  async insert(order) {
    const mongoose = require("mongoose");
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },
  async selectByCustID(_cid) {
    const query = { "customer._id": _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },
  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, {
      new: true,
    });
    return result;
  },
  async selectByID(_id) {
    const orders = await Models.Order.findById(_id).exec();
    return orders;
  },
  async selectByKeyword(keyword) {
    const query = { customer: { $regex: new RegExp(keyword, "i") } };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },
  async sumOrderbyState(status) {
    const query = {};
    const orders = await Models.Order.find(query).exec();
    let totalQuantity = 0;
    for (const order of orders) {
      if (order.status === status) {
        totalQuantity += 1;
      }
    }
    return totalQuantity;
  },
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const orders = await Models.Order.find(query)
      .sort(mysort)
      .limit(top)
      .exec();
    return orders;
  },
};
module.exports = OrderDAO;
