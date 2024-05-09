import React, { useState, useEffect} from "react";
import {
IconButton,

  Typography,
  Box,InputBase,Modal
} from "@mui/material";
import {
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import CategoryDetail from "./CategoryDetailComponent";
import EnhancedTable from "./EnhancedTableComponent";



function Category(props) {
  const [categories, setCategories] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // State for search keyword
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    apiGetCategories();
  }, []);

  const updateCategories = (categories) => {
    setCategories(categories);
  };

  // const trItemClick = (item) => {
  //   setItemSelected(item);
  //   handleOpen();
  // };
  const handleRowClickFromB = (item) => {
    setItemSelected(item);
    handleOpen();
  };
  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetCategoriesByKeyword(searchKeyword);
    }
    else {
      apiGetCategories();
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

  const apiGetCategoriesByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/categories/search/" +keyword, config).then((res) => {
      const result = res.data;
      setCategories(result);
    });
  };

  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "des", numeric: false, disablePadding: false, label: "Description" },
  ];  

  // const cates = categories.map((item) => (
  //   <StyledTableRow
  //     key={item._id}
  //     className="datatable"
  //     onClick={() => trItemClick(item)}
  //   >
  //     <StyledTableCell width="20%">{item._id}</StyledTableCell>
  //     <StyledTableCell width="80%">{item.name}</StyledTableCell>
  //     <StyledTableCell width="80%">{item.des}</StyledTableCell>
  //   </StyledTableRow>
  // ));


  return (
    <div className="cate-div">
      <div className="float-left">
        <Box mt={5} mb={1}>
          <Box mt={2} mb={1}>
            <Typography variant="h5" align="center">
              CATEGORY LIST
            </Typography>
            <Box sx={{ border: "2px solid grey" , borderRadius : "16px",maxWidth: "450px", margin : "auto", mt : 4}}>
              <IconButton color="inherit" onClick={() => handleSearchClick()}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Box>

          </Box>
          {/* <TableContainer component={Paper} sx={{ maxWidth: "80vw",maxHeight: "600px", my: 4, borderRadius: '16px'}}>
            <Table stickyHeader aria-label="sticky table" className="datatable">
              <TableHead >
                <TableRow className="datatable">
                  <StyledTableCell width="30%">ID</StyledTableCell>
                  <StyledTableCell width="50%">Name</StyledTableCell>
                  <StyledTableCell width="80%">Description</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>{cates}</TableBody>
            </Table>
          </TableContainer> */}
          <EnhancedTable rows={categories} headCells={headCells} onRowClick={handleRowClickFromB}/>
        </Box>
      </div>
      <div className="inline" />
      <CategoryDetail
        item={itemSelected}
        updateCategories={updateCategories}
      />
      {/* <Box sx={{ minWidth: "70%" }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CategoryDetail
                item={itemSelected}
                updateCategories={updateCategories}
              />
            </Box>
          </Modal>
        </Box> */}
      </div>
  );
}

export default Category;
