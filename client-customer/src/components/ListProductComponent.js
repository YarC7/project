import axios from "axios";
import React, { useState, useEffect } from "react";
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

function ListProduct(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = props.params;
    if (params.products) {
      apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      apiGetProductsByKeyword(params.keyword);
    } else {
      apiGetProducts();
    }
  }, [props.params]); // Run this effect when props.params changes

  const apiGetProductsByCatID = (cid) => {
    setLoading(true);
    axios.get("http://localhost:3000/api/customer/products/category/" + cid)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  const apiGetProductsByKeyword = (keyword) => {
    setLoading(true);
    axios.get("http://localhost:3000/api/customer/products/search/" + keyword)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products by keyword:", error);
        setLoading(false);
      });
  };

  const apiGetProducts = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/customer/products/list")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        LIST PRODUCTS
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.map((item) => (
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
                      Hàng: {item.brand}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Model: {item.model}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default withRouter(ListProduct);
