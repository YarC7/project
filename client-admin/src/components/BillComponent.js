import axios from "axios";
import React, { useState, useEffect } from 'react';
import BillDetail from "./BillDetailComponent";
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

const Bill = (props) => {
  const [bills, setBills] = useState([]);
  const [noPages, setNoPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [itemSelected, setItemSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleChange = (event, value) => {
    setLoading(true); // Set loading to true before making the API request
    apiGetBills(value);
    setCurPage(curPage);
  };

  const updateBill = (bills, noPages) => {
    setBills(bills);
    setNoPages(noPages);
  };

  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetBillsByKeyword(searchKeyword);
    }
    else {
      apiGetBills(1);
    }
  };

  const apiGetBillsByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/bill/search/" +keyword, config).then((res) => {
      const result = res.data;
      setBills(result);
    });
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request
    apiGetBills(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetBills = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("/api/admin/bill?page=" + page, config);
      const result = response.data;
      console.log(result);
      updateBill(result, result.noPages);
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
    { id: "device", numeric: false, disablePadding: false, label: "Thiết bị" },
    { id: "code", numeric: false, disablePadding: false, label: "Mã hoá đơn" },
    { id: "quantity", numeric: false, disablePadding: false, label: "Số lượng" },
    { id: "price", numeric: false, disablePadding: false, label: "Đơn giá" },
    { id: "tprice", numeric: false, disablePadding: false, label: "Tổng tiền" },
    { id: "cdate", numeric: false, disablePadding: false, label: "Ngày tạo" },
    { id: "producer", numeric: false, disablePadding: false, label: "Nhà cung cấp" },

  ];  

  const handleRowClickFromB = (item) => {
    setItemSelected(item);
    handleOpen();
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Bill LIST
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
              <AddCircleIcon /> Add new Bill
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            // <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4,borderRadius: '16px' }}>
            //   <Table>
            //     <TableHead>
            //       <TableRow>
            //         <StyledTableCell>ID</StyledTableCell>
            //         <StyledTableCell>Thiết bị</StyledTableCell>
            //         <StyledTableCell>Mã Hoá Đơn</StyledTableCell>
            //         <StyledTableCell>Số Lượng</StyledTableCell>
            //         <StyledTableCell>Đơn giá</StyledTableCell>
            //         <StyledTableCell>Tổng giá</StyledTableCell>
            //         <StyledTableCell>Ngày xuất hoá đơn</StyledTableCell>
            //         <StyledTableCell>Nơi cung cấp</StyledTableCell>
            //       </TableRow>
            //     </TableHead>
            //     <TableBody>
            //       {bills?.map((item) => (
            //         <StyledTableRow key={item._id} hover onClick={() => trItemClick(item)}>
            //           <TableCell>{item._id}</TableCell>
            //           <TableCell>{item.product.name}</TableCell>
            //           <TableCell>{item.code}</TableCell>
            //           <TableCell>{item.quantity}</TableCell>
            //           <TableCell>{item.price}</TableCell>
            //           <TableCell>{item.tprice}</TableCell>
            //           <TableCell>{item.cdate}</TableCell>
            //           <TableCell>{item.producer}</TableCell>
            //         </StyledTableRow>
            //       ))}
            //     </TableBody>
            //   </Table>
            // </TableContainer>
            <EnhancedTable rows={bills} headCells={headCells} onRowClick={handleRowClickFromB}/>

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
              <BillDetail item={itemSelected} curPage={curPage} updateBill={updateBill} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default Bill;
