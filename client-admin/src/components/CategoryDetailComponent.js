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
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
      });
    }
  }

  render() {
    return (
      <div className="float-right">
        <Box mt={2} mb={2}>
          <Typography variant="h5" align="center">
            CATEGORY DETAIL
          </Typography>
        </Box>
        <form>
          <TableContainer component={Paper} sx={{ border: "1px solid grey" }}>
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
    if (name) {
      const cate = { name: name };
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
    axios.post("/api/admin/categories", cate, config).then((res) => {
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
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
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
    axios.put("/api/admin/categories/" + id, cate, config).then((res) => {
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
    axios.delete("/api/admin/categories/" + id, config).then((res) => {
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
