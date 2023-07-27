import React, { Component } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import CategoryDetail from "./CategoryDetailComponent";

class Category extends Component {
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

  render() {
    const cates = this.state.categories.map((item) => (
      <TableRow
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
      >
        <TableCell width="20%">{item._id}</TableCell>
        <TableCell width="80%">{item.name}</TableCell>
      </TableRow>
    ));

    return (
      <div>
        <div className="float-left">
          <Box mt={2} mb={2}>
            <Box mt={2} mb={2}>
              <Typography variant="h5" align="center">
                CATEGORY LIST
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table className="datatable" border="1">
                <TableHead>
                  <TableRow className="datatable">
                    <TableCell width="30%">ID</TableCell>
                    <TableCell width="50%">Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{cates}</TableBody>
              </Table>
            </TableContainer>
          </Box>
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
