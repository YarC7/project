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
  CircularProgress,
} from "@mui/material";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      loading: true, // Add loading state
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
    const { loading, newprods, hotprods } = this.state; // Destructure loading, newprods, and hotprods from state
    const newprodsList = newprods.map((item) => this.renderProductItem(item));
    const hotprodsList = hotprods.map((item) => this.renderProductItem(item));

    return (
      <Box sx={{ mt: 4 }}>
        {loading ? ( // Render the loading circle if loading is true
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" align="center" gutterBottom>
                NEW PRODUCTS
              </Typography>
              <Grid container spacing={2}>
                {newprodsList}
              </Grid>
            </Box>
            {hotprods.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h2" align="center" gutterBottom>
                  HOT PRODUCTS
                </Typography>
                <Grid container spacing={2}>
                  {hotprodsList}
                </Grid>
              </Box>
            )}
          </>
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
    this.setState({ loading: true }); // Set loading to true before making the API request
    axios.get("/api/customer/products/new").then((res) => {
      const result = res.data;
      this.setState({ newprods: result, loading: false }); // Set loading to false and update newprods state after the API request is complete
    });
  }

  apiGetHotProducts() {
    this.setState({ loading: true }); // Set loading to true before making the API request
    axios.get("/api/customer/products/hot").then((res) => {
      const result = res.data;
      this.setState({ hotprods: result, loading: false }); // Set loading to false and update hotprods state after the API request is complete
    });
  }
}

export default Home;
