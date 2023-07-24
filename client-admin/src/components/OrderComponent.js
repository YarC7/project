import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import MyContext from "../contexts/MyContext";

class Order extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }

  render() {
    const orders = this.state.orders.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>{item._id}</TableCell>
        <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
        <TableCell>{item.customer.name}</TableCell>
        <TableCell>{item.customer.phone}</TableCell>
        <TableCell>{item.total}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>
          {item.status === "PENDING" && (
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.lnkApproveClick(item._id)}
              >
                APPROVE
              </Button>
              {" || "}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.lnkCancelClick(item._id)}
              >
                CANCEL
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
    ));

    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <TableRow key={item.product._id} className="datatable">
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
      ));
    }

    return (
      <div>
        <div className="align-center">
          <Typography variant="h4" component="h2" align="center">
            ORDER LIST
          </Typography>
          <TableContainer component={Paper}>
            <Table className="datatable" border="1">
              <TableHead>
                <TableRow className="datatable">
                  <TableCell>ID</TableCell>
                  <TableCell>Creation date</TableCell>
                  <TableCell>Cust.name</TableCell>
                  <TableCell>Cust.phone</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{orders}</TableBody>
            </Table>
          </TableContainer>
        </div>
        {this.state.order && (
          <div className="align-center">
            <Typography variant="h4" component="h2" align="center">
              ORDER DETAIL
            </Typography>
            <TableContainer component={Paper}>
              <Table className="datatable" border="1">
                <TableHead>
                  <TableRow className="datatable">
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
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    );
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, "APPROVED");
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, "CANCELED");
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  apiGetOrders() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/orders", config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/orders/status/" + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}

export default Order;
