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
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

const ProductImage = styled(CardMedia)({
  height: 400,
  width: 400,
});

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
    };
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            PRODUCT DETAILS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <ProductImage
                  component="img"
                  image={"data:image/jpg;base64," + prod.image}
                  alt={prod.name}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>ID:</TableCell>
                      <TableCell>{prod._id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name:</TableCell>
                      <TableCell>{prod.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Price:</TableCell>
                      <TableCell>{prod.price} VNĐ</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Category:</TableCell>
                      <TableCell>{prod.category.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quantity:</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 1, max: 99 }}
                          value={this.state.txtQuantity}
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
                          ADD TO CART
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
    axios.get("/api/customer/products/" + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
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
