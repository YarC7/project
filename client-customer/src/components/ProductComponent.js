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
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import withRouter from "../utils/withRouter";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true, // Add loading state
    };
  }
  render() {
    const { loading, products } = this.state; // Destructure loading and products from state
    const prods = products.map((item) => {
      return (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={item._id}
          sx={{ display: "flex" }}
        >
          <Card sx={{ maxWidth: 345, height: "100%" }}>
            <CardActionArea component={Link} to={"/product/" + item._id}>
              <CardMedia
                component="img"
                height="300"
                image={"data:image/jpg;base64," + item.image}
                alt={item.name}
              />
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {item.price} VNĐ
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    });

    return (
      <Box sx={{ flexGrow: 1, marginTop: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          LIST PRODUCTS
        </Typography>
        {loading ? ( // Render the loading circle if loading is true
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {prods}
          </Grid>
        )}
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
    this.setState({ loading: true }); // Set loading to true before making the API request
    axios.get("/api/customer/products/search/" + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result, loading: false }); // Set loading to false and update products state after the API request is complete
    });
  }
  // apis
  apiGetProductsByCatID(cid) {
    this.setState({ loading: true }); // Set loading to true before making the API request
    axios.get("/api/customer/products/category/" + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result, loading: false }); // Set loading to false and update products state after the API request is complete
    });
  }
}
export default withRouter(Product);
