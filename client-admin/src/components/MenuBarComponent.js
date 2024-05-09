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
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const username = JSON.parse(sessionStorage.getItem("username"));
  const handleLogoutClick = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    window.location.href = "/admin";
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorE2);
  const handleClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorE2(null);
  };
  const open3 = Boolean(anchorE3);

  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorE3(null);
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
                Trang chủ
              </Typography>
            </Grid>
            <Grid item>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="inherit"
              >
                Quản lý chung
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorE2}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/category">
                    Quản lý doanh mục
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/product">
                    Quản lý thiết bị
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/user">
                    Quản lý nhân viên
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/bill">
                    Quản lý hoá đơn
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/class">
                    Quản lý phòng học
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/period">
                    Quản lý tiết học
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/order">
                    Quản lý yêu cầu
                  </Button>
                </MenuItem>
              </Menu>
              <Button color="inherit" 
                aria-controls={open3 ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open3 ? 'true' : undefined}
                onClick={handleClick3}>
                Thống kê và Báo cáo
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorE3}
                open={open3}
                onClose={handleClose3}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/category">
                    Thống kê
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/product">
                    Báo cáo lịch sử mượn trả
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/user">
                    Báo cáo sử dụng thiết bị
                  </Button>
                </MenuItem>
              </Menu>
              <Button color="inherit" component={Link} to="/admin/add-admin">
                Tạo Admin
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
            <MenuItem onClick={handleClose}>
                  <Button color="inherit" component={Link} to="/admin/profile">
                    Profile
                  </Button>
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
