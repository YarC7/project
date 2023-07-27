import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: "",
      txtName: "",
      txtPrice: 0,
      cmbCategory: "",
      imgProduct: "",
    };
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (
          <MenuItem
            key={cate._id}
            value={cate._id}
            selected={cate._id === this.props.item.category._id}
          >
            {cate.name}
          </MenuItem>
        );
      } else {
        return (
          <MenuItem key={cate._id} value={cate._id}>
            {cate.name}
          </MenuItem>
        );
      }
    });
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          PRODUCT DETAIL
        </Typography>
        <Box sx={{ maxWidth: 400 }}>
          <TextField
            fullWidth
            label="ID"
            value={this.state.txtID}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Name"
            value={this.state.txtName}
            onChange={(e) => {
              this.setState({ txtName: e.target.value });
            }}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            value={this.state.txtPrice}
            onChange={(e) => {
              this.setState({ txtPrice: e.target.value });
            }}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={this.state.cmbCategory}
              onChange={(e) => {
                this.setState({ cmbCategory: e.target.value });
              }}
              label="Category"
            >
              {cates}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <label htmlFor="file-upload">
              <img
                src={this.state.imgProduct}
                width="300px"
                height="300px"
                alt=""
              />
              <input
                id="file-upload"
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
                style={{ display: "none" }}
              />
              <div className="overlay">
                <i className="fa fa-plus"></i>
              </div>
            </label>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={(e) => this.btnAddClick(e)}
              sx={{ mr: 2 }}
            >
              ADD NEW
            </Button>
            <Button
              variant="contained"
              onClick={(e) => this.btnUpdateClick(e)}
              sx={{ mr: 2 }}
            >
              UPDATE
            </Button>
            <Button variant="contained" onClick={(e) => this.btnDeleteClick(e)}>
              DELETE
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: "data:image/jpg;base64," + this.props.item.image,
      });
    }
  }
  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }
  // apis
  apiGetCategories() {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    ); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
      };
      this.apiPostProduct(prod);
    } else {
      alert("Please input name and price and category and image");
    }
  }
  // apis
  apiPostProduct(prod) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("/api/admin/products", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetProducts();
      } else {
        alert("SORRY BABY!");
      }
    });
  }
  apiGetProducts() {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios
      .get("/api/admin/products?page=" + this.props.curPage, config)
      .then((res) => {
        const result = res.data;
        if (result.products.length !== 0) {
          this.props.updateProducts(result.products, result.noPages);
        } else {
          axios
            .get("/api/admin/products?page=" + (this.props.curPage - 1), config)
            .then((res) => {
              const result = res.data;
              this.props.updateProducts(result.products, result.noPages);
            });
        }
      });
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    ); // remove "data:image/...;base64,"
    if (id && name && price && category && image) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
      };
      this.apiPutProduct(id, prod);
    } else {
      alert("Please input id and name and price and category and image");
    }
  }
  // apis
  apiPutProduct(id, prod) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/products/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetProducts();
      } else {
        alert("SORRY BABY!");
      }
    });
  }
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm("ARE YOU SURE?")) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert("Please input id");
      }
    }
  }
  apiDeleteProduct(id) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("/api/admin/products/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetProducts();
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}
export default ProductDetail;
