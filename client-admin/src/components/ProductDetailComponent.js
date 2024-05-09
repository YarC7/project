import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,Modal
} from "@mui/material";
import axios from "axios";
import BillDetail from "./BillDetailComponent";
import {style } from "./TableComponent"

const ProductDetail = (props) => {
  const [categories, setCategories] = useState([]);
  const [txtID, setTxtID] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtBrand, setTxtBrand] = useState("");
  const [txtModel, setTxtModel] = useState("");
  const [txtQuantity, setTxtQuantity] = useState("");
  const [txtState, setTxtState] = useState("");
  const [txtYear, setTxtYear] = useState("");
  const [txtPDate, seTxtPDate] = useState("");
  const [txtWarranty, setTxtWarranty] = useState("");
  const [txtDescription, setTxtDescription] = useState("");
  const [txtPrice, setTxtPrice] = useState(0);
  const [cmbCategory, setCmbCategory] = useState("");
  const [imgProduct, setImgProduct] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clickAddBill = () => {
    handleOpen();
  };

  useEffect(() => {
    apiGetCategories();
  }, []);

  useEffect(() => {
    if (props.item) {
      const { _id, name, price, category, image , brand , model , quantity , state , year, warranty,pdate,description } = props.item;
      console.log(category);
      setTxtID(_id);
      setTxtName(name);
      setTxtBrand(brand);
      setTxtModel(model);
      setTxtQuantity(quantity);
      setTxtState(state);
      setTxtYear(year);
      seTxtPDate(pdate);
      setTxtWarranty(warranty);
      setTxtDescription(description);
      setTxtPrice(price);
      setCmbCategory(category._id);
      setImgProduct("data:image/jpg;base64," + image);
    }
  }, [props.item]);

  const renderCategories = categories.map((cate) => (
    <MenuItem
      key={cate._id}
      value={cate._id}
      selected={cate._id === props.item?.category._id}
    >
      {cate.name}
    </MenuItem>
  ));

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImgProduct(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const apiGetCategories = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      setCategories(result);
    });
  };

  const btnAddClick = (e) => {
    e.preventDefault();
    const name = txtName.trim(); // Trim whitespace
    const brand = txtBrand.trim();
    const model = txtModel.trim();
    const quantity = parseInt(txtQuantity);
    const state = parseInt(txtState);
    const year = parseInt(txtYear);
    const pdate = parseInt(txtPDate);
    const warranty = parseInt(txtWarranty);
    const description = txtDescription.trim();
    const price = parseInt(txtPrice);
    const category = cmbCategory;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, "").trim(); // Trim base64 image data
  
    if (name && price && category && image && brand && model && quantity && state&& year && pdate && warranty && description) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
        brand: brand,
        model: model,
        quantity: quantity,
        state: state,
        year: year,
        pdate: pdate,
        warranty: warranty,
        description: description,
      };
      apiPostProduct(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostProduct = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("/api/admin/products", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Product added successfully!");
        apiGetProducts();
      } else {
        alert("Failed to add product!");
      }
    });
  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const name = txtName;
    const brand = txtBrand;
    const model = txtModel;
    const quantity = txtQuantity;
    const state = txtState;
    const year = txtYear;
    const pdate = txtPDate;
    const warranty = txtWarranty;
    const description = txtDescription;
    const price = parseInt(txtPrice);
    const category = cmbCategory;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, "");

    if (id && name && price && category && image && brand && model && quantity && state&& year && pdate && warranty && description) {
      const prod = {
        name: name,
        price: price,
        category: category,
        image: image,
        brand : brand,
        model : model,
        quantity : quantity,
        state : state,
        year : year,
        pdate : pdate,
        warranty : warranty,
        description : description,
      };
      apiPutProduct(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutProduct = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/products/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Product updated successfully!");
        apiGetProducts();
      } else {
        alert("Failed to update product!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this product?")) {
      const id = txtID;
      if (id) {
        apiDeleteProduct(id);
      } else {
        alert("Please select a product to delete");
      }
    }
  };

  const apiDeleteProduct = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("/api/admin/products/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Product deleted successfully!");
        apiGetProducts();
      } else {
        alert("Failed to delete product!");
      }
    });
  };

  const apiGetProducts = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/products?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        props.updateProducts(result.products, result.noPages);
      } else {
        axios.get("/api/admin/products?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.updateProducts(result.products, result.noPages);
        });
      }
    });
  };



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
      <Box component="form" sx={{
        '& .MuiTextField-root': { m: 2, width: '25ch' },
      }}>
        <TextField
          width = "200px"
          label="ID"
          value={txtID}
          InputProps={{ readOnly: true }}
          sx={{ m:1 ,width: '25ch' }}
        />
        <TextField
          width = "200px"
          label="Name"
          value={txtName}
          onChange={(e) => {
            setTxtName(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Brand"
          value={txtBrand}
          onChange={(e) => {
            setTxtBrand(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Model"
          value={txtModel}
          onChange={(e) => {
            setTxtModel(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Quantity"
          value={txtQuantity}
          onChange={(e) => {
            setTxtQuantity(e.target.value);
          }}
          sx={{ mt: 2 }}
        />             
        <TextField
          width = "200px"
          label="State"
          value={txtState}
          onChange={(e) => {
            setTxtState(e.target.value);
          }}
          sx={{ mt: 2 }}
        />    
        <TextField
          width = "200px"
          label="Year"
          value={txtYear}
          onChange={(e) => {
            setTxtYear(e.target.value);
          }}
          sx={{ mt: 2 }}
        />   
        <TextField
          width = "200px"
          label="Purchase Date"
          value={txtPDate}
          onChange={(e) => {
            seTxtPDate(e.target.value);
          }}
          sx={{ mt: 2 }}
        />   
        <TextField
          width = "200px"
          label="Warranty"
          value={txtWarranty}
          onChange={(e) => {
            setTxtWarranty(e.target.value);
          }}
          sx={{ mt: 2 }}
        />   
        <TextField
          width = "200px"
          label="Description"
          value={txtDescription}
          onChange={(e) => {
            setTxtDescription(e.target.value);
          }}
          sx={{ mt: 2 }}
        />   
        <TextField
          width = "200px"
          label="Price"
          value={txtPrice}
          onChange={(e) => {
            setTxtPrice(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={cmbCategory}
            onChange={(e) => {
              setCmbCategory(e.target.value);
            }}
            label="Category"
          >
            {renderCategories}
          </Select>
        </FormControl>
        <Box sx={{ m: 2 }}>
          <Button
            variant="outlined"
            onClick={clickAddBill}
            sx={{ mr: 2 }}
          >
            ADD Bill 
          </Button>
        </Box>
        <Box sx={{ m: 2 }}>
          <label htmlFor="file-upload">
            <img
              src={imgProduct}
              width="300px"
              height="300px"
              alt=""
            />
            <input
              id="file-upload"
              type="file"
              name="fileImage"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => previewImage(e)}
              style={{ display: "none" }}
            />
            <div className="overlay">
              <i className="fa fa-plus"></i>
            </div>
          </label>
        </Box>
        <Box sx={{ m: 2 }}>
          <Button
            variant="contained"
            onClick={btnAddClick}
            sx={{ mr: 2 }}
          >
            ADD NEW
          </Button>
          <Button
            variant="contained"
            onClick={btnUpdateClick}
            sx={{ mr: 2 }}
          >
            UPDATE
          </Button>
          <Button variant="contained" onClick={btnDeleteClick}>
            DELETE
          </Button>
        </Box>
        <Box sx={{ minWidth: "70%" }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <BillDetail/>
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
