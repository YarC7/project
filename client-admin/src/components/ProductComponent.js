import axios from "axios";
import React, { useState, useEffect ,forwardRef} from 'react';
import ProductDetail from "./ProductDetailComponent";


import {
  Box,
  CircularProgress,
  Pagination,
  Typography,
  InputBase,
  IconButton,Modal
} from "@mui/material";
import {
  Search as SearchIcon 
} from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {style } from "./TableComponent"
import EnhancedTable from "./EnhancedTableComponent";
import DataTableFilter from "./DataTableFilterComponent";




const Product = (props) =>{
  const [products, setProducts] = useState([]);
  const [noPages, setNoPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [itemSelected, setItemSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [filteredData, setFilteredData] = useState(products);
  const categoryOptions = Array.from(
    new Set(products.filter((row) => !row.headers).map((row) => row.category.name))
  ).map((c) => ({ label: c, value: c }));

  const handleChange = (event, value) => {
    setLoading(true); // Set loading to true before making the API request
    apiGetProducts(value);
    setCurPage(curPage);
  };

  const updateProducts = (products, noPages) => {
    setProducts(products);
    setNoPages(noPages);
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
      apiGetProductsByKeyword(searchKeyword);
    }
    else {
      apiGetProducts(1);
    }
  };

  const apiGetProductsByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/products/search/" +keyword, config).then((res) => {
      const result = res.data;
      setProducts(result);
    });
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request
    apiGetProducts(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetProducts = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/admin/products?page=" + page, config);
      const result = response.data;
      updateProducts(result.products, result.noPages);
    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "price", numeric: false, disablePadding: false, label: "Price" },
    { id: "category", numeric: false, disablePadding: false, label: "Category" },
    { id: "image", numeric: false, disablePadding: false, label: "Image" },
    { id: "brand", numeric: false, disablePadding: false, label: "Brand" },
    { id: "model", numeric: false, disablePadding: false, label: "Model" },
    { id: "quantity", numeric: false, disablePadding: false, label: "Quantity" },
    { id: "state", numeric: false, disablePadding: false, label: "State" },
    { id: "year", numeric: false, disablePadding: false, label: "Year" },
    { id: "pdate", numeric: false, disablePadding: false, label: "PurchaseDate" },
    { id: "warranty", numeric: false, disablePadding: false, label: "Warranty" },
    { id: "description", numeric: false, disablePadding: false, label: "Description" },
  ];  

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            PRODUCT LIST
          </Typography>
          
          <Typography variant="h4" gutterBottom>
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
          </Typography>
          <IconButton color="inherit" onClick={() => handleOpen()}>
              <AddCircleIcon /> Add new Device
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <DataTableFilter
                rows={products}
                setFilteredData={setFilteredData}
                categoryOptions={categoryOptions}
                initialFilters={{
                  name: "",
                  brand: "",
                  model: "",
                  category: [],
                }}
                filterKeys={["name", "brand", "model"]}
              />
              <EnhancedTable rows={filteredData} headCells={headCells} onRowClick={handleRowClickFromB} name={"product"}/>
            </Box>
            // <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4,borderRadius: '16px' ,border: '2px solid grey'}}>
            //   <Table>
            //     <TableHead>
            //       <TableRow>
            //         <StyledTableCell>ID</StyledTableCell>
            //         <StyledTableCell>Name</StyledTableCell>
            //         <StyledTableCell>Brand</StyledTableCell>
            //         <StyledTableCell>Model</StyledTableCell>
            //         <StyledTableCell>Quantity</StyledTableCell>
            //         <StyledTableCell>State</StyledTableCell>
            //         <StyledTableCell>Year</StyledTableCell>
            //         <StyledTableCell>Warranty</StyledTableCell>
            //         <StyledTableCell>Purchase date</StyledTableCell>
            //         <StyledTableCell>Description</StyledTableCell>
            //         <StyledTableCell>Price</StyledTableCell>
            //         <StyledTableCell>Creation date</StyledTableCell>
            //         <StyledTableCell>Category</StyledTableCell>
            //         <StyledTableCell>Image</StyledTableCell>
            //       </TableRow>
            //     </TableHead>
            //     <TableBody>
            //       {products.map((item) => (
            //         <StyledTableRow key={item._id} hover onClick={() => trItemClick(item)}>
            //           <TableCell>{item._id}</TableCell>
            //           <TableCell>{item.name}</TableCell>
            //           <TableCell>{item.brand}</TableCell>
            //           <TableCell>{item.model}</TableCell>
            //           <TableCell>{item.quantity}</TableCell>
            //           <TableCell>{item.state === 1 ? "Ok" : "not Ok"}</TableCell>
            //           <TableCell>{item.year}</TableCell>
            //           <TableCell>{item.warranty}</TableCell>
            //           <TableCell>{item.pdate} ngay mua</TableCell>

            //           <TableCell>{item.description}</TableCell>
            //           <TableCell>{item.price} VND</TableCell>
            //           <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
            //           <TableCell>{item.category.name}</TableCell>
            //           <TableCell>
            //             <Box sx={{ display: "flex", alignItems: "center" }}>
            //               <img src={`data:image/jpg;base64,${item.image}`} width="100px" height="100px" alt="" />
            //             </Box>
            //           </TableCell>
            //         </StyledTableRow>
            //       ))}
            //     </TableBody>
            //   </Table>
            // </TableContainer>

          )}
          <Pagination count={noPages} page={curPage} onChange={handleChange} />
        </Box>
        <Box sx={{ minWidth: "70%" }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ProductDetail item={itemSelected} curPage={curPage} updateProducts={updateProducts}  />
            </Box>
          </Modal>
        </Box>
        
      </Box>
      {/* <Box sx={{ minWidth: "30%", width: "30%" }}>
        <ProductDetail item={itemSelected} curPage={curPage} updateProducts={updateProducts} />
      </Box> */}
    </Box>
  );
};

export default Product;
