import axios from "axios";
import React, { useState, useEffect ,useRef } from 'react';
import PeriodDetail from "./PeriodDetailComponent";
import { useDownloadExcel  } from 'react-export-table-to-excel';
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

const Period = (props) => {
  const [periods, setPeriods] = useState([]);
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
    apiGetPeriod(value);
    setCurPage(curPage);
  };

  const updatePeriod = (periods, noPages) => {
    setPeriods(periods);
    setNoPages(noPages);
  };

  const trItemClick = (item) => {
    setItemSelected(item);
    handleOpen();
  };

  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetPeriodsByKeyword(searchKeyword);
    }
    else {
      apiGetPeriod(1);
    }
  };

  const apiGetPeriodsByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/period/search/" +keyword, config).then((res) => {
      const result = res.data;
      setPeriods(result.period);
    });
  };

  useEffect(() => {
    setLoading(true);
    apiGetPeriod(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetPeriod = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("/api/admin/period?page=" + page, config);
      const result = response.data;
      updatePeriod(result, result.noPages);
    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Period table',
    sheet: 'Period'
})
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Period LIST
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
              <AddCircleIcon /> Add new Period
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ maxWidth: "50vw", my: 4 ,borderRadius: '16px',border: '2px solid #000',overflow: 'auto'}}>
              <Table ref={tableRef}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Thứ tự</StyledTableCell>
                    <StyledTableCell>Thời gian</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periods?.map((item) => (
                    <TableRow key={item._id} hover onClick={() => trItemClick(item)}>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{item.index}</TableCell>
                      <TableCell>{item.from + " : " + item.to}</TableCell>
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
              <PeriodDetail item={itemSelected} curPage={curPage} updatePeriod={updatePeriod} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default Period;
