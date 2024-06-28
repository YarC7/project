import axios from "axios";
import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

const ProductImage = styled(CardMedia)({
  height: 400,
  width: 600,
  margin : "auto",
});

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      loading: true, // Add loading state
    };
  }
  render() {
    const { loading, product, txtQuantity } = this.state; // Destructure loading, product, and txtQuantity from state
    if (loading) {
      // Render the loading circle if loading is true
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (product != null) {
      // Render the UI once the product details have been fetched
      return (
        <Box sx={{ m : 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            PRODUCT DETAILS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <ProductImage
                  component="img"
                  image={"data:image/jpg;base64," + product.image}
                  alt={product.name}
                />
              </Card>
              <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>ID:</TableCell>
                      <TableCell>{product._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name:</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Model:</TableCell>
                      <TableCell>{product.model}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Brand:</TableCell>
                      <TableCell>{product.brand}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Available:</TableCell>
                      <TableCell>{product.state == 1 ? "Available" : product.state == 2 ? "In Use" : "Out of stock"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Category:</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity:</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 1, max: 99 }}
                          value={txtQuantity}
                          onChange={(e) => {
                            this.setState({ txtQuantity: e.target.value });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddShoppingCart />}
                          onClick={(e) => this.btnAdd2CartClick(e)}
                        >
                          Thêm vào danh sách yêu cầu
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Grid>
          </Grid>
        </Box>
      );
    }
    return <div />;
  }
  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }
  // apis
  apiGetProduct(id) {
    this.setState({ loading: true }); // Set loading to true before making the API request
    axios.get("http://localhost:3000/api/customer/products/" + id).then((res) => {
      const result = res.data;
      this.setState({ product: result, loading: false }); // Set loading to false and update product state after the API request is complete
    });
  }
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex((x) => x.product._id === product._id); // check if the _id exists in mycart
      if (index === -1) {
        // not found, push newItem
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else {
        // increasing the quantity
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert("OK BABY!");
    } else {
      alert("Please input quantity");
    }
  }
}
export default withRouter(ProductDetail);
