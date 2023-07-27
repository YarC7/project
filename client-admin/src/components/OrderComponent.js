import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Snackbar,
} from "@mui/material";
import MyContext from "../contexts/MyContext";

class Order extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      isLoading: false,
      snackbarOpen: false,
      snackbarMessage: "",
    };
  }

  render() {
    const { orders, order, isLoading, snackbarOpen, snackbarMessage } =
      this.state;

    const orderItems = orders.map((item) => (
      <Card
        key={item._id}
        sx={{ mb: 2, p: 2, cursor: "pointer" }}
        onClick={() => this.trItemClick(item)}
      >
        <Typography variant="h6" component="h3">
          Order #{item._id}
        </Typography>
        <Typography variant="body1">
          <strong>Creation date:</strong>{" "}
          {new Date(item.cdate).toLocaleString()}
        </Typography>
        <Typography variant="body1">
          <strong>Customer:</strong> {item.customer.name} ({item.customer.phone}
          )
        </Typography>
        <Typography variant="body1">
          <strong>Total:</strong> {item.total}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {item.status}
        </Typography>
        {item.status === "PENDING" && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.lnkApproveClick(item._id)}
            >
              APPROVE
            </Button>
            <Box component="span" mx={1} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.lnkCancelClick(item._id)}
            >
              CANCEL
            </Button>
          </Box>
        )}
      </Card>
    ));

    let orderDetail = null;
    if (order) {
      const items = order.items.map((item, index) => (
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
      orderDetail = (
        <Box mt={4}>
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
        </Box>
      );
    }

    return (
      <div>
        <Box mt={4}>
          <Typography variant="h4" component="h2" align="center">
            ORDER LIST
          </Typography>
          {isLoading ? (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={2}>
              {orderItems.length === 0 ? (
                <Typography variant="body1" align="center">
                  No orders found.
                </Typography>
              ) : (
                orderItems
              )}
            </Box>
          )}
        </Box>
        {orderDetail}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => this.setState({ snackbarOpen: false })}
        >
          <Typography variant="body1">{snackbarMessage}</Typography>
        </Snackbar>
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
    this.setState({ isLoading: true }, () => {
      this.apiGetOrders();
    });
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  apiGetOrders() {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/orders", config).then((res) => {
      const result = res.data;
      this.setState({ orders: result, isLoading: false });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/orders/status/" + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState(
          { snackbarOpen: true, snackbarMessage: "Order status updated." },
          () => {
            this.apiGetOrders();
          }
        );
      } else {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: "Failed to update order status.",
        });
      }
    });
  }
}

export default Order;
