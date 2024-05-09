//CLI: npm install mongoose --save
const mongoose = require("mongoose");
// schemas
const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
  },
  { versionKey: false }
);
const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    des: String,
  },
  { versionKey: false }
);
const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    code : String,
    name: String,
    phone: String,
    email: String,
    major : String,
    image: String,
  },
  { versionKey: false }
);
const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
  },
  { versionKey: false }
);
const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    brand: String,
    model: String,
    quantity: Number,
    state: Number,
    year: Number,
    price: Number,
    image: String,
    cdate: Number,
    pdate: Number,
    warranty: Number,
    description: String,
    category: CategorySchema,
  },
  { versionKey: false }
);
const ClassSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    room: String,
    stair: Number,
    zone: String,
    building: String,
  },
  { versionKey: false }
);
const PeriodSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    index : Number,
    from : String,
    to : String ,
  },
  { versionKey: false }
);
const BillSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    code : String,
    product: ProductSchema,
    producer : String,
    quantity : Number,
    tprice : Number,
    price : Number,
    cdate : String ,
  },
  { versionKey: false }
);
const ItemSchema = mongoose.Schema(
  {
    product: ProductSchema,
    quantity: Number,
  },
  { versionKey: false, _id: false }
);
const UsedSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    teacher: UserSchema,
    items: [ItemSchema],
    classes: ClassSchema,
    period: PeriodSchema,
    purpose: String,
    des: String,
    date : String
  },
  { versionKey: false }
);


const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema],
    used : UsedSchema
  },
  { versionKey: false }
);
// models
const Admin = mongoose.model("Admin", AdminSchema);
const Category = mongoose.model("Category", CategorySchema);
const Customer = mongoose.model("Customer", CustomerSchema);
const Used = mongoose.model("Used", UsedSchema);
const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);
const Class = mongoose.model("Class", ClassSchema);
const Bill = mongoose.model("Bill", BillSchema);
const Period = mongoose.model("Period", PeriodSchema);
module.exports = { Admin, Category, Product , User ,Used , Class , Bill ,Period , Order , Customer};
