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
  CircularProgress,
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
      loading: false, // Add loading state
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
    };
    if (this.state.order) {
      var used = this.state.order.used;
      var usedDetails = []; // Mảng để lưu trữ thông tin của used
      if (used) { // Kiểm tra xem used có tồn tại không
        usedDetails.push(
          <TableRow key="usedDetails"> {/* Sử dụng key để tránh lỗi */}
            <TableCell>{used.purpose}</TableCell>
            <TableCell>{"Phòng: "+used.classes?.zone +used.classes?.stair+ "." + used.classes?.room+ " - " +"Cơ sở : "+ used.classes?.building }</TableCell>
            <TableCell>{"Tiết :"+ used.period?.index+ " từ " + used.period?.from + " đến " +used.period?.to}</TableCell>
            <TableCell>{used.des}</TableCell>
          </TableRow>
        );
      }
    }
    return (
      <div>
        <br/>
        <Typography variant="h4" align="center">
          Danh sách các yêu cầu
        </Typography>
        <TableContainer component={Paper}>
          <MyTable>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Mã giảng viên</TableCell>
                <TableCell>Tên giảng viên</TableCell>
                <TableCell>Só điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tình trạng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{orders}</TableBody>
          </MyTable>
        </TableContainer>
        {this.state.loading ? ( // Render the loading circle if loading is true
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : this.state.order ? (
          <div>
            <br/>
            <br/>
            <br/>
            <Typography variant="h4" align="center">
              Chi tiết yêu cầu
            </Typography>
            <TableContainer component={Paper}>
              <MyTable>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Prod.ID</TableCell>
                    <TableCell>Prod.name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Model</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{items}</TableBody>
              </MyTable>
            </TableContainer>
            <br/>
            <br/>
            <br/>
            <Typography variant="h4" align="center">
              Chi tiết sử dụng
            </Typography>
            <TableContainer component={Paper}>
              <MyTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Mục đích</TableCell>
                    <TableCell>Nơi sử dụng</TableCell>
                    <TableCell>Thời gian sử dụng</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{usedDetails}</TableBody>
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
      this.setState({ loading: true }); // Set loading to true before making the API request
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
      this.setState({ orders: result, loading: false }); // Set loading to false after the API request is complete
    });
  }
}
export default Myorders;
