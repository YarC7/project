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
  Button,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
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
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container alignItems="center">
            <Grid item>
              <Typography
                variant="h6"
                component={Link}
                to="/admin/home"
                sx={{ flexGrow: 1, textDecoration: "none" }}
                color="inherit"
              >
                Shop Cảnh Phúc
              </Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" component={Link} to="/admin/category">
                Category
              </Button>
              <Button color="inherit" component={Link} to="/admin/product">
                Product
              </Button>
              <Button color="inherit" component={Link} to="/admin/order">
                Order
              </Button>
              <Button color="inherit" component={Link} to="/admin/customer">
                Customer
              </Button>
              <Button color="inherit" component={Link} to="/admin/add-admin">
                Create Admin
              </Button>
            </Grid>
          </Grid>
        </Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Hello, <b>{username}</b>
          </Typography>
          <IconButton onClick={handleMenuClick} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
