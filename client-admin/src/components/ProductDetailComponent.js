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
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <h2>PRODUCT DETAIL</h2>
        </Box>
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
            <input
              type="file"
              name="fileImage"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => this.previewImage(e)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <img
              src={this.state.imgProduct}
              width="300px"
              height="300px"
              alt=""
            />
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
  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
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
    const image = this.state.imgProduct.replace("data:image/jpeg;base64,", "");
    const product = { name, price, category, image };
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/products", product, config).then((res) => {
      this.props.updateProducts();
      this.setState({
        txtID: "",
        txtName: "",
        txtPrice: 0,
        cmbCategory: "",
        imgProduct: "",
      });
    });
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace("data:image/jpeg;base64,", "");
    const product = { name, price, category, image };
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/products/" + id, product, config).then((res) => {
      this.props.updateProducts();
    });
  }
  btnDeleteClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    if (window.confirm("Are you sure you want to delete this product?")) {
      const config = { headers: { "x-access-token": this.context.token } };
      axios.delete("/api/admin/products/" + id, config).then((res) => {
        this.props.updateProducts();
        this.setState({
          txtID: "",
          txtName: "",
          txtPrice: 0,
          cmbCategory: "",
          imgProduct: "",
        });
      });
    }
  }
}
export default ProductDetail;
