import React, { Component } from "react";
import {
  TextField,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtName: "",
      txtDes: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtDes: this.props.item.des,
      });
    }
  }

  render() {
    return (
      <div className="float-right">
        <Box mt={5} mb={2}>
          <Typography variant="h5" align="center">
            CATEGORY DETAIL
          </Typography>
        </Box>
        <form>
          <TableContainer component={Paper} sx={{ border: "2px solid grey" , borderRadius : "16px" , mt : "134px"}}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="text"
                      value={this.state.txtID}
                      onChange={(e) => {
                        this.setState({ txtID: e.target.value });
                      }}
                      disabled
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="text"
                      value={this.state.txtName}
                      onChange={(e) => {
                        this.setState({ txtName: e.target.value });
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="text"
                      value={this.state.txtDes}
                      onChange={(e) => {
                        this.setState({ txtDes: e.target.value });
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <ButtonGroup variant="contained" color="primary">
                      <Button
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        onClick={(e) => this.btnAddClick(e)}
                      >
                        ADD NEW
                      </Button>
                      <Button
                        startIcon={<ModeEditOutlinedIcon />}
                        onClick={(e) => this.btnUpdateClick(e)}
                      >
                        UPDATE
                      </Button>
                      <Button
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={(e) => this.btnDeleteClick(e)}
                      >
                        DELETE
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </div>
    );
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const des = this.state.txtDes;
    if (name) {
      const cate = { name: name , des : des};
      this.apiPostCategory(cate);
    } else {
      alert("Please input name");
    }
  }

  apiPostCategory(cate) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("http://localhost:3000/api/admin/categories", cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetCategories();
      } else {
        alert("SORRY BABY!");
      }
    });
  }

  apiGetCategories() {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const des = this.state.txtDes;

    if (id && name && des) {
      const cate = { name: name , des : des};
      this.apiPutCategory(id, cate ,des);
    } else {
      alert("Please input id and name");
    }
  }

  apiPutCategory(id, cate) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("http://localhost:3000/api/admin/categories/" + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetCategories();
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
        this.apiDeleteCategory(id);
      } else {
        alert("Please input id");
      }
    }
  }

  apiDeleteCategory(id) {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("http://localhost:3000/api/admin/categories/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.apiGetCategories();
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}

export default CategoryDetail;
