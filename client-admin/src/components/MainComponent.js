import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import MenuBar from "./MenuBarComponent";
import Home from "./HomeComponent";
import Category from "./CategoryComponent";
import Product from "./ProductComponent";
import { Routes, Route, Navigate } from "react-router-dom";
import Order from "./OrderComponent";
import Customer from "./CustomerComponent";
import SignupAdmin from "./SignupAdminComponent";
import Footer from "./FooterComponent";
import Login from "./LoginComponent";
import Signup from "./SignUpComponent";
class Main extends Component {
  render() {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (token !== null) {
        return (
          <div className="body-admin">
            <MenuBar />
            <Routes>
              <Route
                path="/admin"
                element={<Navigate replace to="/admin/home" />}
              />
              <Route path="/admin/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/home" element={<Home />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/product" element={<Product />} />
              <Route path="/admin/order" element={<Order />} />
              <Route path="/admin/customer" element={<Customer />} />
              <Route path="/admin/add-admin" element={<SignupAdmin />} />
            </Routes>
            <Footer/>
          </div>
        );
      }
      else {
        return (
          <div className="body-admin">
            <Routes>
              <Route
                path="/admin"
                element={<Navigate replace to="/login" />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        );
      }
    } catch (error) {
      console.error(error);
    }
    return <div />;
  }
}
export default Main;
