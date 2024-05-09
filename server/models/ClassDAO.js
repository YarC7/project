require("../utils/MongooseUtil");
const Models = require("./Models");

const ClassDAO = {
  async selectAll() {
    const query = {};
    const classes = await Models.Class.find(query).exec();
    return classes;
  },
  async insert(classes) {
    const mongoose = require("mongoose");
    classes._id = new mongoose.Types.ObjectId();
    const result = await Models.Class.create(classes);
    return result;
  },
  async selectByID(_id) {
    const classes = await Models.Class.findById(_id).exec();
    return classes;
  },
  async update(classes) {
    const newvalues = {
      room: classes.room,
      stair: classes.stair,
      zone: classes.zone,
      building: classes.building,
    };
    const result = await Models.Class.findByIdAndUpdate(
      classes._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Class.findByIdAndRemove(_id);
    return result;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const classes = await Models.Class.find(query).exec();
    return classes;
  },
};
module.exports = ClassDAO;
