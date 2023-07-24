import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import MyContext from "../contexts/MyContext";

const Menu = () => {
  const { username, setToken, setUsername } = useContext(MyContext);

  const handleLogoutClick = () => {
    setToken("");
    setUsername("");
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <div className="float-left">
          <ul className="menu">
            <li className="menu">
              <Link to="/admin/home">Home</Link>
            </li>
            <li className="menu">
              <Link to="/admin/category">Category</Link>
            </li>
            <li className="menu">
              <Link to="/admin/product">Product</Link>
            </li>
            <li className="menu">
              <Link to="/admin/order">Order</Link>
            </li>
            <li className="menu">
              <Link to="/admin/customer">Customer</Link>
            </li>
          </ul>
        </div>
        <div className="float-right">
          <Typography variant="subtitle1">
            Hello <b>{username}</b> |{" "}
            <Button
              component={Link}
              to="/admin/home"
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
