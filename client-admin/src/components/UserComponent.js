import axios from "axios";
import React, { useState, useEffect } from 'react';
import UserDetail from "./UserDetailComponent";
import {
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputBase,
  IconButton,Modal
} from "@mui/material";
import {
  Search as SearchIcon 
} from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {StyledTableCell, StyledTableRow, style } from "./TableComponent"

const User = (props) => {
  const [users, setUsers] = useState([]);
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
    apiGetUsers(value);
    setCurPage(curPage);
  };

  const updateUsers = (users, noPages) => {
    setUsers(users);
    setNoPages(noPages);
  };

  const trItemClick = (item) => {
    setItemSelected(item);
    handleOpen();
  };

  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetUsersByKeyword(searchKeyword);
    }
    else {
      apiGetUsers(1);
    }
  };

  const apiGetUsersByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/users/search/" +keyword, config).then((res) => {
      const result = res.data;
      setUsers(result);
    });
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request
    apiGetUsers(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetUsers = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/admin/users?page=" + page, config);
      const result = response.data;
      updateUsers(result.users, result.noPages);
    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            User LIST
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
              <AddCircleIcon /> Add new User
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4 ,borderRadius: '16px',border: '2px solid #000',}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Major</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone</StyledTableCell>
                    <StyledTableCell>Image</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((item) => (
                    <StyledTableRow key={item._id} hover onClick={() => trItemClick(item)}>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.major}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img src={`data:image/jpg;base64,${item.image}`} width="100px" height="100px" alt="" />
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              <UserDetail item={itemSelected} curPage={curPage} updateUsers={updateUsers} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default User;
