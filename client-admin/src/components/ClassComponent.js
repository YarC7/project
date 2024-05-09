import axios from "axios";
import React, { useState, useEffect } from 'react';
import ClassDetail from "./ClassDetailComponent";
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
import EnhancedTable from "./EnhancedTableComponent";
import DataTableFilter from "./DataTableFilterComponent";

const Class = (props) => {
  const [classes, setClasses] = useState([]);
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
  const [filteredData, setFilteredData] = useState(classes);

  const handleChange = (event, value) => {
    setLoading(true); // Set loading to true before making the API request
    apiGetClasses(value);
    setCurPage(curPage);
  };

  const updateClasses = (classes, noPages) => {
    setClasses(classes);
    setNoPages(noPages);
  };


  const handleSearchClick = () => {
    if (searchKeyword){
      apiGetClassesByKeyword(searchKeyword);
    }
    else {
      apiGetClasses(1);
    }
  };

  const apiGetClassesByKeyword = (keyword) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/classes/search/" +keyword, config).then((res) => {
      const result = res.data;
      setClasses(result);
    });
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before making the API request
    apiGetClasses(curPage);
  }, [curPage]); // Run on initial render and page change

  const apiGetClasses = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("/api/admin/classes?page=" + page, config);
      const result = response.data;
      updateClasses(result.classes, result.noPages);
    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };
  const handleRowClickFromB = (item) => {
    setItemSelected(item);
    console.log(itemSelected);
    handleOpen();
  };
  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    { id: "room", numeric: false, disablePadding: false, label: "Phòng" },
    { id: "stair", numeric: false, disablePadding: false, label: "Tầng" },
    { id: "zone", numeric: false, disablePadding: false, label: "Toà" },
    { id: "building", numeric: false, disablePadding: false, label: "Cơ sở" },

  ];  
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: "1 1 0" }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Class LIST
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
              <AddCircleIcon /> Add new Class
          </IconButton>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <DataTableFilter
                rows={classes}
                setFilteredData={setFilteredData}
                initialFilters={{
                  room: "",
                  stair: "",
                  zone: "",
                  building: "",
                }}
                filterKeys={["room", "stair","zone","building"]}
              />
              <EnhancedTable rows={filteredData} headCells={headCells} onRowClick={handleRowClickFromB}/>
            </Box>
            // <TableContainer component={Paper} sx={{ maxWidth: "80vw", my: 4 }}>
            //   <Table>
            //     <TableHead>
            //       <TableRow>
            //         <TableCell>ID</TableCell>
            //         <TableCell>Phòng số</TableCell>
            //         <TableCell>Lầu</TableCell>
            //         <TableCell>Cơ sở</TableCell>
            //         <TableCell>Toà</TableCell>
            //       </TableRow>
            //     </TableHead>
            //     <TableBody>
            //       {classes.map((item) => (
            //         <TableRow key={item._id} hover onClick={() => trItemClick(item)}>
            //           <TableCell>{item._id}</TableCell>
            //           <TableCell>{item.room}</TableCell>
            //           <TableCell>{item.stair}</TableCell>
            //           <TableCell>{item.zone}</TableCell>
            //           <TableCell>{item.building}</TableCell>
            //         </TableRow>
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
              <ClassDetail item={itemSelected} curPage={curPage} updateClasses={updateClasses} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
};

export default Class;
