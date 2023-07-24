import React, { Component } from "react";
import {
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
import CategoryDetail from "./CategoryDetailComponent";

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };

  componentDidMount() {
    this.apiGetCategories();
  }

  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // apis
  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
      >
        <TableCell>{item._id}</TableCell>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ));

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">CATEGORY LIST</h2>
          <TableContainer component={Paper}>
            <Table className="datatable" border="1">
              <TableHead>
                <TableRow className="datatable">
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{cates}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="inline" />
        <CategoryDetail
          item={this.state.itemSelected}
          updateCategories={this.updateCategories}
        />
      </div>
    );
  }
}

export default Category;
