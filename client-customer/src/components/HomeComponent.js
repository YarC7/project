import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }

  renderProductItem(item) {
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
  }

  render() {
    const newprods = this.state.newprods.map((item) =>
      this.renderProductItem(item)
    );
    const hotprods = this.state.hotprods.map((item) =>
      this.renderProductItem(item)
    );

    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" align="center" gutterBottom>
            NEW PRODUCTS
          </Typography>
          <Grid container spacing={2}>
            {newprods}
          </Grid>
        </Box>
        {this.state.hotprods.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" align="center" gutterBottom>
              HOT PRODUCTS
            </Typography>
            <Grid container spacing={2}>
              {hotprods}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // apis
  apiGetNewProducts() {
    axios.get("/api/customer/products/new").then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get("/api/customer/products/hot").then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}

export default Home;
