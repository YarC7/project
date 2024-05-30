const express = require("express");
// const bcrypt = require("bcrypt");
const router = express.Router();
// const crypto = require("crypto");
const CryptoUtil = require("../utils/CryptoUtil");
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
// utils
const JwtUtil = require("../utils/JwtUtil");
const EmailUtil = require("../utils/EmailUtil");
// daos
const AdminDAO = require("../models/AdminDAO");
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const OrderDAO = require("../models/OrderDAO");
const CustomerDAO = require("../models/CustomerDAO");
const UserDAO = require("../models/UserDAO");
const UsedDAO = require("../models/UsedDAO");
const BillDAO = require("../models/BillDAO");
const ClassDAO = require("../models/ClassDAO");
const PeriodDAO = require("../models/PeriodDAO");
// login

router.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const dbCust = await AdminDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.json({ success: false, message: "Exists username or email" });
  } else {
    const now = new Date().getTime(); // milliseconds
    const token = CryptoUtil.md5(now.toString());
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newCust = {
      username: username,
      password: hash,
      name: name,
      phone: phone,
      email: email,
      token: token,
    };
    const result = await AdminDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        res.json({ success: true, message: "Please check email" });
      } else {
        res.json({ success: false, message: "Email failure" });
      }
    } else {
      res.json({ success: false, message: "Insert failure" });
    }
  }
});
router.put("/profile/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  const customer = {
    _id: _id,
    username: username,
    password: hash,
    name: name,
    phone: phone,
    email: email,
  };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});
router.put("/user/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, salt);
  const user = {
    _id: _id,
    // username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
  };
  const result = await AdminDAO.update(user);
  res.json(result);
});
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(JSON.stringify(req.headers));
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password
    );
    if (admin) {
      const token = JwtUtil.genToken();
      res.json({
        success: true,
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});
router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});
// customer
router.get("/customers",async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
router.put(
  "/customers/deactive/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
  }
);
router.get(
  "/customers/sendmail/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);
    if (cust) {
      const send = await EmailUtil.send(cust.email, cust._id, cust.token);
      if (send) {
        res.json({ success: true, message: "Please check email" });
      } else {
        res.json({ success: false, message: "Email failure" });
      }
    } else {
      res.json({ success: false, message: "Not exists customer" });
    }
  }
);
// user

router.get("/users/all", JwtUtil.checkToken, async function (req, res) {
  const users = await UserDAO.selectAll();
  res.json(users);
});

router.get("/users", JwtUtil.checkToken, async function (req, res) {
  // get data
  var users = await UserDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(users.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /users?page=xxx
  const offset = (curPage - 1) * sizePage;
  users = users.slice(offset, offset + sizePage);
  // return
  const result = { users: users, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post("/users", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const major = req.body.major;
  const email = req.body.email;
  const phone = req.body.phone;
  const image = req.body.image;
  const user = { name: name , major: major, email: email , phone: phone ,image: image};
  const result = await UserDAO.insert(user);
  res.json(result);
});
router.put("/users/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const major = req.body.major;
  const email = req.body.email;
  const phone = req.body.phone;
  const image = req.body.image;
  const user = { _id: _id, name: name , major: major, email: email , phone: phone ,image: image};
  const result = await UserDAO.update(user);
  res.json(result);
});
router.delete("/users/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await UserDAO.delete(_id);
  res.json(result);
});
router.get("/users/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const users = await UserDAO.selectByKeyword(keyword);
  res.json(users);
});

//used
router.get("/useds", JwtUtil.checkToken, async function (req, res) {
  // get data
  var useds = await UsedDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(useds.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /useds?page=xxx
  const offset = (curPage - 1) * sizePage;
  useds = useds.slice(offset, offset + sizePage);
  // return
  const result = { useds: useds, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post("/useds", JwtUtil.checkToken, async function (req, res) {
  const uid = req.body.user;
  const teacher = await UserDAO.selectByID(uid);
  const pid = req.body.device;
  const product = await ProductDAO.selectByID(pid);
  const cid = req.body.classes;
  const classes = await ClassDAO.selectByID(cid);
  const peid = req.body.period;
  const period = await PeriodDAO.selectByID(peid);
  const time = req.body.time;
  const purpose = req.body.purpose;
  const des = req.body.des;
  const used = { teacher: teacher , product: product, classes: classes, period: period,time: time , purpose: purpose ,des: des};
  const result = await UsedDAO.insert(used);
  res.json(result);
});
router.put("/useds/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const uid = req.body.user;
  const teacher = await UserDAO.selectByID(uid);
  const pid = req.body.device;

  const product = await ProductDAO.selectByID(pid);
  const time = req.body.time;
  const purpose = req.body.purpose;
  const des = req.body.des;
  const cid = req.body.classes;
  const classes = await ClassDAO.selectByID(cid);
  const peid = req.body.period;
  const period = await PeriodDAO.selectByID(peid);
  const used = { _id: _id, teacher: teacher , product: product,classes: classes, time: time , purpose: purpose ,des: des, period: period};
  const result = await UsedDAO.update(used);
  res.json(result);
});
router.delete("/useds/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await UsedDAO.delete(_id);
  res.json(result);
});
router.get("/useds/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const useds = await UsedDAO.selectByKeyword(keyword);
  res.json(useds);
});

//classes

router.get("/class", JwtUtil.checkToken, async function (req, res) {
  const classes = await ClassDAO.selectAll();
  res.json(classes);
});
router.get("/classes", JwtUtil.checkToken, async function (req, res) {
  // get data
  var classes = await ClassDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(classes.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /classes?page=xxx
  const offset = (curPage - 1) * sizePage;
  classes = classes.slice(offset, offset + sizePage);
  // return
  const result = { classes: classes, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post("/classes", JwtUtil.checkToken, async function (req, res) {
  const room = req.body.room;
  const stair = req.body.stair;
  const zone = req.body.zone;
  const building = req.body.building;
  const classes = {  room: room , stair: stair ,zone: zone, building : building};
  const result = await ClassDAO.insert(classes);
  res.json(result);
});
router.put("/classes/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const room = req.body.room;
  const stair = req.body.stair;
  const building = req.body.building;
  const zone = req.body.zone;
  const classes = { _id: _id, room: room , stair: stair ,zone: zone, building: building};
  const result = await ClassDAO.update(classes);
  res.json(result);
});
router.delete("/classes/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ClassDAO.delete(_id);
  res.json(result);
});
router.get("/classes/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const classes = await ClassDAO.selectByKeyword(keyword);
  res.json(classes);
});


//period
router.get("/period", JwtUtil.checkToken, async function (req, res) {
  const periods = await PeriodDAO.selectAll();
  res.json(periods);
});

router.get("/period", JwtUtil.checkToken, async function (req, res) {
  // get data
  var period = await PeriodDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(period.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /period?page=xxx
  const offset = (curPage - 1) * sizePage;
  period = period.slice(offset, offset + sizePage);
  // return
  const result = { period: period, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post("/period", JwtUtil.checkToken, async function (req, res) {
  const index = req.body.index;
  const from = req.body.from;
  const to = req.body.to;
  const period = {  index: index , from: from ,to: to};
  const result = await PeriodDAO.insert(period);
  res.json(result);
});
router.put("/period/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const index = req.body.index;
  const from = req.body.from;
  const to = req.body.to;
  const period = { _id: _id, index: index , from: from ,to: to};
  const result = await PeriodDAO.update(period);
  res.json(result);
});
router.delete("/period/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await PeriodDAO.delete(_id);
  res.json(result);
});
router.get("/period/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const period = await PeriodDAO.selectByKeyword(keyword);
  res.json(period);
});
//bill

router.get("/bill", JwtUtil.checkToken, async function (req, res) {
  const bill = await BillDAO.selectAll();
  res.json(bill);
});
router.get("/bill", JwtUtil.checkToken, async function (req, res) {
  // get data
  var bill = await BillDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(bill.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /bill?page=xxx
  const offset = (curPage - 1) * sizePage;
  bill = bill.slice(offset, offset + sizePage);
  // return
  const result = { bill: bill, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post("/bill", JwtUtil.checkToken, async function (req, res) {
  const producer = req.body.producer;
  const quantities = req.body.quantities;
  const code = req.body.code;
  const product = req.body.device;
  const tprice = req.body.tprice;
  const prices = req.body.prices;
  const cdate = req.body.cdate;
  const pid = req.body.pid;
  // console.log(prices);
  // console.log(quantities);
  const bill = {  product : product ,code : code,producer: producer , quantities: quantities ,pid:pid,tprice: tprice, prices : prices  , cdate:cdate};
  // console.log(bill);
  const result = await BillDAO.insert(bill);
  res.json(result);
});
router.put("/bill/:id", JwtUtil.checkToken, async function (req, res) {
  const producer = req.body.producer;
  const code = req.body.code;
  const quantity = req.body.quantity;
  const tprice = req.body.tprice;
  const price = req.body.price;
  const cdate = req.body.cdate;
  const year = req.body.year;
  const bill = { _id: _id, producer: producer,code : code , quantity: quantity ,tprice: tprice, price : price  , cdate:cdate , year: year};
  const result = await BillDAO.update(bill);
  res.json(result);
});
router.delete("/bill/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await BillDAO.delete(_id);
  res.json(result);
});
router.get("/bill/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const bill = await BillDAO.selectByKeyword(keyword);
  res.json(bill);
});

// category
router.get("/categories", JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
router.post("/categories", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const des = req.body.des;
  const category = { name: name , des: des};
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
router.put("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const des = req.body.des;
  const category = { _id: _id, name: name , des: des};
  const result = await CategoryDAO.update(category);
  res.json(result);
});
router.delete("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});
router.get("/categories/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const categories = await CategoryDAO.selectByKeyword(keyword);
  res.json(categories);
});
// product

router.get("/devices", JwtUtil.checkToken, async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});
router.get("/devices/sum", JwtUtil.checkToken, async function (req, res) {
  const state1 = await ProductDAO.sumProductbyState(0);
  const state2 = await ProductDAO.sumProductbyState(1);
  const state3 = await ProductDAO.sumProductbyState(2);
  const number = await ProductDAO.sumProductbyQuantity();

  const result = { number: number, state1: state1, state2: state2 , state3: state3,};

  res.json(result);
});

router.get("/products", JwtUtil.checkToken, async function (req, res) {
  // get data
  var products = await ProductDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.post("/products", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const brand = req.body.brand;
  const model = req.body.model;
  const quantity = req.body.quantity;
  const state = req.body.state;
  const year = req.body.year;
  const pdate = req.body.pdate;
  const warranty = req.body.warranty;
  const description = req.body.description;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    name: name,
    brand : brand,
    model : model,
    quantity : quantity,
    state : state,
    year : year,
    pdate : pdate,
    warranty : warranty,
    description : description,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.insert(product);
  res.json(result);
});
router.put("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const brand = req.body.brand;
  const model = req.body.model;
  const quantity = req.body.quantity;
  const state = req.body.state;
  const year = req.body.year;
  const pdate = req.body.pdate;
  const warranty = req.body.warranty;
  const description = req.body.description;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    _id: _id,
    name: name,
    brand : brand,
    model : model,
    quantity : quantity,
    state : state,
    year : year,
    pdate : pdate,
    warranty : warranty,
    description : description,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});
// order
router.get("/orders", JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.get("/orders/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const orders = await OrderDAO.selectByKeyword(keyword);
  res.json(orders);
});
router.put("/orders/status/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});
router.get(
  "/orders/customer/:cid",
  JwtUtil.checkToken,
  async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  }
);
router.get("/orders/sum", JwtUtil.checkToken, async function (req, res) {
  const state1 = await OrderDAO.sumOrderbyState("APPROVED");
  const state2 = await OrderDAO.sumOrderbyState("PENDING");
  const state3 = await OrderDAO.sumOrderbyState("CANCELED");
  const result = { state1: state1, state2: state2 , state3: state3,};
  res.json(result);
});
router.get("/orders/hot", async function (req, res) {
  const orders = await OrderDAO.selectTopNew(4);
  const result = { orders: orders};
  res.json(result);
});
router.post("/add-admin", JwtUtil.checkToken, async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.json({
      success: false,
      message: "Please provide both username and password.",
    });
    return;
  }
  const dbAdmin = await AdminDAO.selectByUsername(username);
  if (dbAdmin) {
    res.json({ success: false, message: "Exists username" });
  } else {
    const admin = { username: username, password: password };
    const result = await AdminDAO.insert(admin);
    res.json({
      success: true,
      message: "Create Admin Successful",
    });
  }
});
router.post("/report", async function (req, res) {
  const array = req.body.array;

  const resl = await AdminDAO.export(4);
  const result = { resl: resl};
  res.json(result);
});

module.exports = router;
