import React, { useState, useEffect } from "react";
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

function Category() {
  const [categories, setCategories] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);

  useEffect(() => {
    apiGetCategories();
  }, []);

  const updateCategories = (categories) => {
    setCategories(categories);
  };

  const trItemClick = (item) => {
    setItemSelected(item);
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

  const cates = categories.map((item) => (
    <TableRow
      key={item._id}
      className="datatable"
      onClick={() => trItemClick(item)}
    >
      <TableCell width="20%">{item._id}</TableCell>
      <TableCell width="80%">{item.name}</TableCell>
      <TableCell width="80%">{item.des}</TableCell>
    </TableRow>
  ));

  return (
    <div className="cate-div">
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
                  <TableCell width="50%">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{cates}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
      <div className="inline" />
      <CategoryDetail
        item={itemSelected}
        updateCategories={updateCategories}
      />
    </div>
  );
}

export default Category;
