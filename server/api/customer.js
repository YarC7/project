const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// utils
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");
// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");
const OrderDAO = require("../models/OrderDAO");
// customer
router.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
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
      active: 0,
      token: token,
    };
    const result = await CustomerDAO.insert(newCust);
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
router.post("/active", async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username) {
    const customer = await CustomerDAO.selectByUsername(username);
    if (customer) {
      const isMatch = await bcrypt.compare(password, customer.password);

      if (isMatch) {
        if (customer.active === 1) {
          const token = JwtUtil.genToken();
          res.json({
            success: true,
            message: "Authentication successful",
            token: token,
            customer: customer,
          });
        } else {
          res.json({ success: false, message: "Account is deactivated" });
        }
      } else {
        res.json({
          success: false,
          message: "Password Incorrect",
        });
      }
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
router.put("/customers/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
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
// category
router.get("/categories", async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product
router.get("/products/new", async function (req, res) {
  const products = await ProductDAO.selectTopNew(4);
  res.json(products);
});
router.get("/products/hot", async function (req, res) {
  const products = await ProductDAO.selectTopHot(4);
  res.json(products);
});
router.get("/products/category/:cid", async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get("/products/:id", async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
// mycart
router.post("/checkout", JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = {
    cdate: now,
    total: total,
    status: "PENDING",
    customer: customer,
    items: items,
  };
  const result = await OrderDAO.insert(order);
  res.json(result);
});
// myorders
router.get(
  "/orders/customer/:cid",
  JwtUtil.checkToken,
  async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  }
);

//neww

router.post("/forgot", async function (req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const existingUser = await CustomerDAO.selectByEmail(email);

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "No user found for this email address." });
    }

    const token = crypto.randomBytes(20).toString("hex");

    existingUser.token = token;

    await existingUser.save(); // Use await here to ensure the save operation completes before proceeding.

    const resetLink = `http://localhost:3000/api/customer/reset/${token}`;
    await EmailUtil.reset(existingUser.email, resetLink);

    res.status(200).json({
      success: true,
      message: "Please check your email for the link to reset your password.",
    });
  } catch (error) {
    console.error("Error:", error); // Log the error message for debugging purposes
    res.status(500).json({
      error:
        "An error occurred while processing your request. Please try again later.",
    });
  }
});

router.post("/reset/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const resetUser = await CustomerDAO.selectByToken(token); // Pass the token directly

    if (!resetUser) {
      return res.status(400).json({
        error:
          "Your token has expired. Please attempt to reset your password again.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    resetUser.password = hash;

    await resetUser.save(); // Use 'await' to ensure the save operation completes before proceeding.

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging purposes
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});
module.exports = router;
