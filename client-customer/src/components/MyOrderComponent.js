import axios from "axios";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import {
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

const MyTable = styled(Table)({
  minWidth: 650,
});

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }
  render() {
    if (this.context.token === "") return <Navigate replace to="/login" />;
    const orders = this.state.orders.map((item) => {
      return (
        <TableRow key={item._id} onClick={() => this.trItemClick(item)}>
          <TableCell>{item._id}</TableCell>
          <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
          <TableCell>{item.customer.name}</TableCell>
          <TableCell>{item.customer.phone}</TableCell>
          <TableCell>{item.total}</TableCell>
          <TableCell>{item.status}</TableCell>
        </TableRow>
      );
    });
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <TableRow key={item.product._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.product._id}</TableCell>
            <TableCell>{item.product.name}</TableCell>
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
          </TableRow>
        );
      });
    }
    return (
      <div>
        <Typography variant="h4" align="center">
          ORDER LIST
        </Typography>
        <TableContainer component={Paper}>
          <MyTable>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Creation date</TableCell>
                <TableCell>Cust.name</TableCell>
                <TableCell>Cust.phone</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{orders}</TableBody>
          </MyTable>
        </TableContainer>
        {this.state.order ? (
          <div>
            <Typography variant="h4" align="center">
              ORDER DETAIL
            </Typography>
            <TableContainer component={Paper}>
              <MyTable>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Prod.ID</TableCell>
                    <TableCell>Prod.name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{items}</TableBody>
              </MyTable>
            </TableContainer>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/customer/orders/customer/" + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Myorders;
