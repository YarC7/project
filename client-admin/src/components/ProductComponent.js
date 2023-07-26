import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Pagination,
} from "@mui/material";
import ProductDetail from "./ProductDetailComponent";

class Product extends Component {
  static contextType = MyContext;

  state = {
    products: [],
    noPages: 0,
    curPage: 1,
    itemSelected: null,
  };

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.curPage !== this.state.curPage) {
      this.apiGetProducts(this.state.curPage);
    }
  }

  render() {
    const { products, noPages, curPage, itemSelected } = this.state;
    const prods = products.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
      >
        <TableCell>{item._id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.price}</TableCell>
        <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
        <TableCell>{item.category.name}</TableCell>
        <TableCell>
          <img
            src={"data:image/jpg;base64," + item.image}
            width="100px"
            height="100px"
            alt=""
          />
        </TableCell>
      </TableRow>
    ));

    return (
      <Box>
        <Box className="float-left">
          <Typography variant="h4" component="h2" align="center">
            PRODUCT LIST
          </Typography>
          <TableContainer>
            <Table className="datatable" border="1">
              <TableHead>
                <TableRow className="datatable">
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
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={noPages}
                page={curPage}
                onChange={(_, value) => this.lnkPageClick(value)}
              />
            </Box>
          </TableContainer>
        </Box>
        <div className="inline" />
        <ProductDetail
          item={itemSelected}
          curPage={curPage}
          updateProducts={this.updateProducts}
        />
        <Box className="float-clear" />
      </Box>
    );
  }

  updateProducts = (products, noPages) => {
    this.setState({ products, noPages });
  };

  lnkPageClick(index) {
    this.setState({ curPage: index });
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

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
