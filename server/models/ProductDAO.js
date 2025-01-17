require("../utils/MongooseUtil");
const Models = require("./Models");

const ProductDAO = {
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async insert(product) {
    const mongoose = require("mongoose");
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },
  async update(product) {
    const newvalues = {
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      quantity: product.quantity,
      state: product.state,
      year: product.year,
      pdate: product.pdate,
      warranty: product.warranty,
      description: product.description,
      image: product.image,
      category: product.category,
    };
    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Product.findByIdAndRemove(_id);
    return result;
  },
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const products = await Models.Product.find(query)
      .sort(mysort)
      .limit(top)
      .exec();
    return products;
  },
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: "APPROVED" } },
      { $unwind: "$items" },
      {
        $group: { _id: "$items.product._id", sum: { $sum: "$items.quantity" } },
      },
      { $sort: { sum: -1 } }, // descending
      { $limit: top },
    ]).exec();
    var products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      products.push(product);
    }
    return products;
  },
  async selectMost(status) {
    try {
      const approvedOrders = await Models.Order.find({ status: status }).select('items.product.name items.quantity');
  
      const productQuantities = approvedOrders.reduce((acc, order) => {
        order.items.forEach(item => {
          const productId = item.product.name;
          const quantity = item.quantity;
          if (acc[productId]) {
            acc[productId] += quantity;
          } else {
            acc[productId] = quantity;
          }
        });
        return acc;
      }, {});
      const result = Object.keys(productQuantities).map(productId => ({
        _id: productId,
        quantity: productQuantities[productId]
      }));
      return result;
    } catch (err) {
      console.error(err);
    }
  },
  
  async selectByCatID(_cid) {
    const query = { "category._id": _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async sumProductbyState(state) {
    const query = {};
    const products = await Models.Product.find(query).exec();
    let totalQuantity = 0;
    for (const product of products) {
      if (product.state === state) {
        totalQuantity += product.quantity;
      }
    }
    return totalQuantity;
  },
  async sumProductbyQuantity() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    let totalQuantity = 0;
    for (const product of products) {
      totalQuantity += product.quantity;
    }
    return totalQuantity;
  },
};
module.exports = ProductDAO;
