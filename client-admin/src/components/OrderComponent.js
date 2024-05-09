import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
styled,tableCellClasses,

  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Snackbar,Modal,InputBase,
  IconButton,
} from "@mui/material";

import {
  Search as SearchIcon 
} from "@mui/icons-material";
import DataTableFilter from "./DataTableFilterComponent";
import EnhancedTable from "./EnhancedTableComponent";



const Order = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [filteredData, setFilteredData] = useState(orders);


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: theme.palette.text.disabled,
      // color: theme.palette.text.primary,
      backgroundColor: theme.palette.info.main,
      color: 'white',
      fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    borderRadius: '16px'
  };

  const nameOptions = Array.from(
    new Set(orders.filter((row) => !row.headers).map((row) => row.customer.name))
  ).map((c) => ({ label: c, value: c }));
  
  const statusOptions = [{label : "APPROVED" , value : "APPROVED"},{label : "CANCELED" , value : "CANCELED"},{label : "PENDING" , value : "PENDING"}]


  const apiGetOrders = () => {
    setIsLoading(true);
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/orders", config).then((res) => {
      const result = res.data;
      setOrders(result);
      setIsLoading(false);
    });
  };

  const apiPutOrderStatus = (id, status) => {
    const body = { status: status };
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/orders/status/" + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        setSnackbarOpen(true);
        setSnackbarMessage("Order status updated.");
        apiGetOrders();
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to update order status.");
      }
    });
  };

  useEffect(() => {
    apiGetOrders();
  }, []); // Run only once on component mount



  const lnkApproveClick = (id) => {
    apiPutOrderStatus(id, "APPROVED");
  };

  const lnkCancelClick = (id) => {
    apiPutOrderStatus(id, "CANCELED");
  };

  const handleRowClickFromB = (item) => {
    setOrder(item);
    handleOpen();
  };
  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetOrdersByKeyword(searchKeyword);
    }
    else {
      apiGetOrders(1);
    }
  };

  const apiGetOrdersByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/orders/search/" +keyword, config).then((res) => {
      const result = res.data;
      setOrders(result);
    });
  };
  // const orderItems = orders.map((item) => (
  //   <Card
  //     key={item._id}
  //     sx={{ m: 2, p: 2, cursor: "pointer", maxWidth: 600 }}
  //     onClick={() => trItemClick(item)}
  //   >
  //     <Typography variant="h6" component="h3">
  //       Order #{item._id}
  //     </Typography>
  //     <Typography variant="body1">
  //       <strong>Creation date:</strong>{" "}
  //       {new Date(item.cdate).toLocaleString()}
  //     </Typography>
  //     <Typography variant="body1">
  //       <strong>Customer:</strong> {item.customer.name} ({item.customer.phone}
  //       )
  //     </Typography>
  //     <Typography variant="body1">
  //       <strong>Total:</strong> {item.total}
  //     </Typography>
  //     <Typography variant="body1">
  //       <strong>Status:</strong> {item.status}
  //     </Typography>
  //     {item.status === "PENDING" && (
  //       <Box 
  //         display="flex"
  //         alignItems="center"
  //         justify-content= 'center'>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           onClick={() => lnkApproveClick(item._id)}
  //         >
  //           APPROVE
  //         </Button>
  //         <Box component="span" mx={1} />
  //         <Button
  //           variant="contained"
  //           color="secondary"
  //           onClick={() => lnkCancelClick(item._id)}
  //         >
  //           CANCEL
  //         </Button>
  //       </Box>
  //     )}
  //   </Card>
  // ));

  let orderDetail = null;
  if (order) {
    const items = order.items.map((item, index) => (
      <TableRow key={item.product._id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{item.product._id}</TableCell>
        <TableCell>{item.product.name}</TableCell>
        <TableCell>{item.product.brand}</TableCell>
        <TableCell>{item.product.model}</TableCell>
        <TableCell>
          <img
            src={"data:image/jpg;base64," + item.product.image}
            width="70px"
            height="70px"
            alt=""
          />
        </TableCell>
        <TableCell align="center">{item.quantity}</TableCell>
      </TableRow>
    ));
    if (order) {
      var used = order.used;
      var usedDetails = []; // Mảng để lưu trữ thông tin của used
      if (used) { // Kiểm tra xem used có tồn tại không
        usedDetails.push(
          <TableRow key="usedDetails"> {/* Sử dụng key để tránh lỗi */}
            <TableCell>{"Phòng: "+used.classes?.zone +used.classes?.stair+ "." + used.classes?.room+ " - " +"Cơ sở : "+ used.classes?.building }</TableCell>
            <TableCell>{"Tiết :"+ used.period?.index+ " từ " + used.period?.from + " đến " +used.period?.to}</TableCell>
            <TableCell>{used.purpose}</TableCell>
            <TableCell>{used.des}</TableCell>
          </TableRow>
        );
      }
    }
    orderDetail = (
      <Box m={1}>
        <Typography variant="h4" component="h2" align="center">
          Chi tiết yêu cầu
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '16px' , margin : "16px 0" }}>
          <Table >
            <TableHead>
              <TableRow >
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell>Prod.ID</StyledTableCell>
                <StyledTableCell>Prod.name</StyledTableCell>
                <StyledTableCell>Brand</StyledTableCell>
                <StyledTableCell>Model</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{items}</TableBody>
          </Table>
        </TableContainer>
        <br/>
        <Typography variant="h4" align="center">
          Chi tiết sử dụng
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '16px' , margin : "16px 0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nơi sử dụng</StyledTableCell>
                <StyledTableCell>Thời gian sử dụng</StyledTableCell>
                <StyledTableCell>Mục đích</StyledTableCell>
                <StyledTableCell>Ghi chú</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{usedDetails}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }


  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    { id: "customer", numeric: false, disablePadding: false, label: " Customer Name" },
    { id: "cdate", numeric: false, disablePadding: false, label: "Creation Date" },
    { id: "status", numeric: false, disablePadding: false, label: "Status" },
  ];  

  return (
    <div>
      <Box mt={4} 
        display="flex"
        alignItems="center"
        flexDirection= "column" >
        <Typography variant="h4" component="h2" align="center">
          ORDER LIST
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

        {isLoading ? (
          <Box mt={2} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={2} sx={{ }} 
            display="flex"
            alignItems="center"
            flexDirection= "column"
            width='100%'
            gap={4}>
            {orders.length === 0 ? (
              <Typography variant="body1" align="center">
                No orders found.
              </Typography>
            ) : (
              <Box>
                <DataTableFilter
                  rows={orders}
                  setFilteredData={setFilteredData}
                  nameOptions={nameOptions}
                  statusOptions={statusOptions}
                  initialFilters={{
                    customer: [],
                    status : []
                  }}
                  filterKeys={["cdate"]}
                />
                {/* <TableContainer component={Paper} sx={{ width: "100%",maxHeight: "100%" ,borderRadius: '16px',border: '2px solid grey'}}>
                  <Table aria-label="customized table" sx={{ width: "100%"}}>
                    <TableHead>
                      <TableRow> 
                        <StyledTableCell>Mã yêu cầu</StyledTableCell>
                        <StyledTableCell>Giảng viên</StyledTableCell>
                        <StyledTableCell>Ngày tạo</StyledTableCell>
                        <StyledTableCell>Tình trạng</StyledTableCell>             
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((item) => (
                        <StyledTableRow sx={{height: "100px"}} key={item._id} hover onClick={() => trItemClick(item)}>
                          <TableCell>{item._id}</TableCell>
                          <TableCell>{item.customer.name}</TableCell>
                          <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
                          <TableCell>
                            {item.status === "PENDING" && (
                                <Box 
                                  display="flex"
                                  alignItems="center"
                                  justify-content= 'space-around'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => lnkApproveClick(item._id)}
                                >
                                    APPROVE
                                </Button>
                                <Box component="span" mx={1} />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => lnkCancelClick(item._id)}
                                >
                                    CANCEL
                                </Button>
                                </Box>
                            )}
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}
              <EnhancedTable rows={filteredData} headCells={headCells} 
                onRowClick={handleRowClickFromB} 
                onCanClick={lnkCancelClick} 
                onAppClick={lnkApproveClick} 
                />
              </Box>

              
            )}
          </Box>
        )}
      </Box>
      
      <Box sx={{ minWidth: "70%" , m: '1' }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {orderDetail}
            </Box>
          </Modal>
        </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Typography variant="body1">{snackbarMessage}</Typography>
      </Snackbar>
    </div>
  );
};

export default Order;
