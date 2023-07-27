import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trCustomerClick(item)}
      >
        <TableCell>{item._id}</TableCell>
        <TableCell>{item.username}</TableCell>
        <TableCell>{item.password}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.phone}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.active}</TableCell>
        <TableCell>
          {item.active === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.lnkEmailClick(item)}
            >
              EMAIL
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.lnkDeactiveClick(item)}
            >
              DEACTIVE
            </Button>
          )}
        </TableCell>
      </TableRow>
    ));

    const orders = this.state.orders.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trOrderClick(item)}
      >
        <TableCell>{item._id}</TableCell>
        <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
        <TableCell>{item.customer.name}</TableCell>
        <TableCell>{item.customer.phone}</TableCell>
        <TableCell>{item.total}</TableCell>
        <TableCell>{item.status}</TableCell>
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
          <h2 className="text-center">CUSTOMER LIST</h2>
          <TableContainer component={Paper}>
            <Table className="datatable" border="1">
              <TableHead>
                <TableRow className="datatable">
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{customers}</TableBody>
            </Table>
          </TableContainer>
        </div>

        {this.state.orders.length > 0 ? (
          <div className="align-center">
            <h2 className="text-center">ORDER LIST</h2>
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
                  </TableRow>
                </TableHead>
                <TableBody>{orders}</TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : null}

        {this.state.order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
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
        ) : null}
      </div>
    );
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  apiGetCustomerSendmail(id) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/customers/sendmail/" + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios
      .put("/api/admin/customers/deactive/" + id, body, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.apiGetCustomers();
        } else {
          alert("SORRY BABY!");
        }
      });
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  apiGetCustomers() {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/customers", config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/orders/customer/" + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default Customer;
