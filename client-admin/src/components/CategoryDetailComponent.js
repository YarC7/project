import React, { Component } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
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
        <h2 className="text-center">CATEGORY DETAIL</h2>
        <form>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={this.state.txtID}
                      onChange={(e) => {
                        this.setState({ txtID: e.target.value });
                      }}
                      readOnly
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>
                    <TextField
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => this.btnAddClick(e)}
                    >
                      ADD NEW
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => this.btnUpdateClick(e)}
                    >
                      UPDATE
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => this.btnDeleteClick(e)}
                    >
                      DELETE
                    </Button>
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
    const config = { headers: { "x-access-token": this.context.token } };
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
    const config = { headers: { "x-access-token": this.context.token } };
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
    const config = { headers: { "x-access-token": this.context.token } };
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
    const config = { headers: { "x-access-token": this.context.token } };
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
