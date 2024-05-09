import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Stack,
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material";
import {
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import withRouter from "../utils/withRouter";

const StyledMenu = styled(Menu)({
  "& .MuiList-root": {
    minWidth: "200px",
  },
});

function NavigationComponent({ navigate }) {
  const { token, customer, mycart } = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [txtKeyword, setTxtKeyword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [open2, setOpen2] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    apiGetCategories();
  }, []);
  const open = Boolean(anchorE2);

  const handleClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorE2(null);
  };

  const handleClick2 = (event) => {
    setAnchorE3(event.currentTarget);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const apiGetCategories = () => {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      setCategories(result);
    });
  };

  const cates = categories.map((item) => {
    return (
      <MenuItem key={item._id} onClick={handleMenuClose}>
        <Link
          to={"/product/category/" + item._id}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
            <span style={{ marginRight: "8px" }}>{item.name}</span>
          </Box>
        </Link>
      </MenuItem>
    );
  });

  const handleLogoutClick = () => {
    sessionStorage.removeItem(token);
    sessionStorage.removeItem(customer);
    sessionStorage.removeItem(mycart);
  };

  const handleSearchClick = () => {
    navigate("/product/search/" + txtKeyword);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleClick}
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MenuIcon />
          </IconButton>
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
                  <Button color="inherit" component={Link} to="/product/list">
                    Danh sách Thiết bị
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose2}>
                  <Button color="inherit"
                           aria-controls={open2 ? 'demo-positioned-menu' : undefined}
                           aria-haspopup="true"
                           aria-expanded={open2 ? 'true' : undefined}
                           onClick={handleClick2}>
                    Danh sách Thiết bị theo danh mục
                  </Button>
                  {cates}
                  
                </MenuItem>
                  
              </Menu>

          <Link to="/home" style={{ textDecoration: "none" }}>
            <Typography
              variant="h5"
              component="div"
              style={{ color: "white" }}
            >
              Home
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {token === "" ? (
            <Stack direction="row" spacing={2}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button style={{ color: "white" }}>Login</Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button style={{ color: "white" }}>Sign up</Button>
              </Link>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" color="inherit" component="div">
                Hello{" "}
                <IconButton
                  component={Link}
                  to="/myprofile"
                  color="inherit"
                  size="small"
                >
                  <AccountCircle />
                </IconButton>
                <Typography variant="subtitle1" component="span">
                  {customer?.name}
                </Typography>
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  component={Link}
                  to="/myorders"
                  color="inherit"
                  size="small"
                >
                  <Typography variant="body2" component="div">
                    Yêu cầu của tôi
                  </Typography>
                </IconButton>
                <IconButton
                  onClick={handleLogoutClick}
                  color="inherit"
                  size="small"
                >
                  <Typography variant="body2" component="div">
                    Đăng xuất
                  </Typography>
                </IconButton>
              </Stack>
            </Stack>
          )}
          <IconButton color="inherit" onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search"
            value={txtKeyword}
            onChange={(e) => {
              setTxtKeyword(e.target.value);
            }}
          />
          <Link to="/mycart" style={{ textDecoration: "none" }}>
            <IconButton color="inherit">
              <Badge badgeContent={mycart.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(NavigationComponent);
