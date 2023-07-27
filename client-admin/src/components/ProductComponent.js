import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import ProductDetail from "./ProductDetailComponent";
import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <TableRow
          key={item._id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          hover
          onClick={() => this.trItemClick(item)}
        >
          <TableCell>{item._id}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.price}</TableCell>
          <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
          <TableCell>{item.category.name}</TableCell>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={`data:image/jpg;base64,${item.image}`}
                width="100px"
                height="100px"
                alt=""
              />
            </Box>
          </TableCell>
        </TableRow>
      );
    });
    const handleChange = (event, value) => {
      this.apiGetProducts(value);
    };
    return (
      <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
        <Box sx={{ minWidth: "70%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              PRODUCT LIST
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Creation date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{prods}</TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={this.state.noPages}
              page={this.state.curPage}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box sx={{ minWidth: "30%", width: "30%" }}>
          <ProductDetail
            item={this.state.itemSelected}
            curPage={this.state.curPage}
            updateProducts={this.updateProducts}
          />
        </Box>
      </Box>
    );
  }
  updateProducts = (products, noPages) => {
    // arrow-function
    this.setState({ products: products, noPages: noPages });
  };
  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/products?page=" + page, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage,
      });
    });
  }
}
export default Product;
