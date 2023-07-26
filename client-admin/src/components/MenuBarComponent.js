import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import MyContext from "../contexts/MyContext";

const MenuBar = () => {
  const { username, setToken, setUsername } = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogoutClick = () => {
    setToken("");
    setUsername("");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container alignItems="center">
            <Grid item>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
        </Box>
        <div className="float-right">
          <Typography variant="subtitle1">
            <IconButton onClick={handleMenuClick}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
            Hello <b>{username}</b>
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
