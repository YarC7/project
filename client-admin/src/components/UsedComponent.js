import axios from "axios";
import React, { useState, useEffect } from 'react';
import UsedDetail from "./UsedDetailComponent";
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

const Used = (props) => {
  const [useds, setUseds] = useState([]);
  const [noPages, setNoPages] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const [itemSelected, setItemSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleChange = (event, value) => {
    setLoading(true); // Set loading to true before making the API request
    apiGetUseds(value);
    setCurPage(curPage);
  };

  const updateUseds = (useds, noPages) => {
    setUseds(useds);
    setNoPages(noPages);
  };

  const trItemClick = (item) => {
    setItemSelected(item);
    handleOpen();
  };

  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetUsedsByKeyword(searchKeyword);
    }
    else {
      apiGetUseds(1);
    }
  };

  const apiGetUsedsByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/useds/search/" +keyword, config).then((res) => {
      const result = res.data;
      setUseds(result);
    });
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request
    apiGetUseds(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetUseds = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/admin/useds?page=" + page, config);
      const result = response.data;
      updateUseds(result.useds, result.noPages);
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
            Used LIST
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
              <AddCircleIcon /> Add new Used
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Thiết bị</TableCell>
                    <TableCell>Mục Đích</TableCell>
                    <TableCell>Thời gian sử dụng</TableCell>
                    <TableCell>Giảng viên</TableCell>
                    <TableCell>Lớp sử dụng</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {useds?.map((item) => (
                    <TableRow key={item._id} hover onClick={() => trItemClick(item)}>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.purpose}</TableCell>
                      <TableCell>{"Tiết :"+ item.period?.index+ " từ " + item.period?.from + " đến " +item.period?.to}</TableCell>
                      <TableCell>{item.teacher.name}</TableCell>
                      <TableCell>{"Phòng: "+item.classes?.zone +item.classes?.stair+ "." + item.classes?.room+ " - " +"Cơ sở : "+ item.classes?.building }</TableCell>
                      <TableCell>{item.des}</TableCell>
                    </TableRow>
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
              <UsedDetail item={itemSelected} curPage={curPage} updateUseds={updateUseds} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default Used;
