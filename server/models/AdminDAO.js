require("../utils/MongooseUtil");
const excelJS = require("exceljs");
const Models = require("./Models");

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
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
  async update(admin) {
    const newvalues = {
      password: admin.password,
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
    };
    const result = await Models.Admin.findByIdAndUpdate(
      admin._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async export(array,name) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(name); // New Worksheet
    const headers = new Set();
    array.forEach(item => {
        Object.keys(item).forEach(key => {
            headers.add(key);
        });
    });
    const header = Array.from(headers);
    array.forEach(row => {
      worksheet.addRow(row);
    });
    workbook.xlsx.writeFile('data.xlsx')
    .then(() => {
        console.log('Excel file created successfully!');
    })
    .catch(err => {
        console.error('Error creating Excel file:', err);
    });
  },
};
module.exports = AdminDAO;
