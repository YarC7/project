import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import withRouter from "../utils/withRouter";

const MyTable = styled(Table)({
  minWidth: 650,
});

const MyButton = styled(Button)({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <TableRow key={item.product._id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{item.product._id}</TableCell>
          <TableCell>{item.product.name}</TableCell>
          <TableCell>{item.product.category.name}</TableCell>
          <TableCell>
            <img
              src={"data:image/jpg;base64," + item.product.image}
              width="70px"
              height="70px"
              alt=""
            />
          </TableCell>
          <TableCell>{item.product.price}</TableCell>
          <TableCell>{item.quantity}</TableCell>
          <TableCell>{item.product.price * item.quantity}</TableCell>
          <TableCell>
            <MyButton
              variant="contained"
              disableElevation
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              Remove
            </MyButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div>
        <Typography variant="h4" align="center">
          ITEM LIST
        </Typography>
        <TableContainer component={Paper}>
          <MyTable>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mycart}
              <TableRow>
                <TableCell colSpan="6" />
                <TableCell>Total</TableCell>
                <TableCell>{CartUtil.getTotal(this.context.mycart)}</TableCell>
                <TableCell>
                  <MyButton
                    variant="contained"
                    disableElevation
                    onClick={() => this.lnkCheckoutClick()}
                  >
                    CHECKOUT
                  </MyButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </MyTable>
        </TableContainer>
      </div>
    );
  }

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      // found, remove item
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm("ARE YOU SURE?")) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate("/login");
        }
      } else {
        alert("Your cart is empty");
      }
    }
  }

  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/customer/checkout", body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.context.setMycart([]);
        this.props.navigate("/home");
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}

export default withRouter(Mycart);
