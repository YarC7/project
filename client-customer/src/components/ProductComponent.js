import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import withRouter from "../utils/withRouter";

const ProductCard = styled(Card)({
  maxWidth: 345,
  margin: "auto",
  marginTop: 16,
});

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <Grid item xs={12} sm={6} md={4} key={item._id}>
          <ProductCard>
            <Link to={"/product/" + item._id}>
              <CardMedia
                component="img"
                height="200"
                image={"data:image/jpg;base64," + item.image}
                alt={item.name}
              />
            </Link>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: {item.price}
              </Typography>
            </CardContent>
          </ProductCard>
        </Grid>
      );
    });

    return (
      <Box sx={{ flexGrow: 1, marginTop: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          LIST PRODUCTS
        </Typography>
        <Grid container spacing={2}>
          {prods}
        </Grid>
      </Box>
    );
  }
  componentDidMount() {
    // first: /product/...
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  componentDidUpdate(prevProps) {
    // changed: /product/...
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }
  apiGetProductsByKeyword(keyword) {
    axios.get("/api/customer/products/search/" + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
  // apis
  apiGetProductsByCatID(cid) {
    axios.get("/api/customer/products/category/" + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}
export default withRouter(Product);