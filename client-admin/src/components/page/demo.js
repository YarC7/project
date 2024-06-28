import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartComponent from "./chart.tsx";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CardContent,
  CardActionArea,
  Grid,Card
} from "@mui/material";
import {StyledTableCell, StyledTableRow } from "../TableComponent"
import CircleIcon from '@mui/icons-material/Circle';
ChartJS.register(ArcElement, Tooltip, Legend);


const Demo = (props) => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [number, setNumber] = useState(0);
  const [state1, setState1] = useState(0);
  const [state2, setState2] = useState(0);
  const [state3, setState3] = useState(0);
  const [state01, setState01] = useState(0);
  const [state02, setState02] = useState(0);
  const [state03, setState03] = useState(0);
  const [list, setList] = useState(0);
  const [list1, setList1] = useState(0);
  const [list2, setList2] = useState(0);

  const [newOrders, setNewOrders] = useState([]);

  const apiGetIn4 = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/admin/devices", config);
      const response2 = await axios.get("http://localhost:3000/api/admin/categories", config);
      const response3 = await axios.get("http://localhost:3000/api/admin/orders", config);
      const response4 = await axios.get("http://localhost:3000/api/admin/devices/sum", config);
      const response5 = await axios.get("http://localhost:3000/api/admin/orders/sum", config);
      const response6 = await axios.get("http://localhost:3000/api/admin/orders/hot", config);
      const response7 = await axios.get("http://localhost:3000/api/admin/products/most", config);
      const result = response.data;
      const result2 = response2.data;
      const result3 = response3.data;
      const result4 = response4.data;
      const result5 = response5.data;
      const result6 = response6.data;
      const result7 = response7.data;
      setProducts(result);
      setCategories(result2);
      setOrders(result3);
      setNumber(result4.number);
      setState1(result4.state1);
      setState2(result4.state2);
      setState3(result4.state3);
      setState01(result5.state1);
      setState02(result5.state2);
      setState03(result5.state3);
      console.log(result5);
      setNewOrders(result6);
      setList(result7.products.map((item) => (item._id)))
      setList1(result7.products.map((item) => (item.quantity)))
      setList2(result7.products2.map((item) => (item.quantity)))

    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    }
  };

  const apiExport = async (page) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    try {
      const response = await axios.get("http://localhost:3000/api/admin/export", config);
    } catch (error) {
      console.error(error); // Handle API request errors gracefully
    }
  };
  useEffect(() => {
    apiGetIn4();
  }, []); // Run on initial render and page change
  const headCells = [
    {
      id: "_id",
      numeric: false,
      disablePadding: true,
      label: "ID"
    },
    { id: "customer", numeric: false, disablePadding: false, label: "Name" },
    { id: "device", numeric: false, disablePadding: false, label: "Device" },
    { id: "status", numeric: false, disablePadding: false, label: "Status" },
  ];  
  const data = {
    labels: ['Available', 'In Use', 'Not Available'],
    datasets: [
      {
        label: '# of Votes',
        data: [state1,state2,state3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: ['APPROVED', 'CANCELED','APPENDING' ],
    datasets: [
      {
        label: '# of Votes',
        data: [state01,state02,state03],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", m: 4 }}>
      <Box sx={{ minWidth: "100%" }}>
        <Box sx={{alignItems: "center", p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Thống kê
          </Typography>
          <Box>

          <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          spacing={4} p={2} 
          sx={{ display: "flex" }}
          >
          <Box width={"400px"} sx={{ m:4 ,borderRadius: '16px',border: '2px solid #000',p: 4}}>
            
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              Thiết bị
            </Typography>
            <Pie data={data} />
          </Box>
          <Box width={"400px"}sx={{ m:4 ,borderRadius: '16px',border: '2px solid #000',p: 4}}>
            
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              Yêu cầu
            </Typography>
            <Pie data={data2} />
          </Box>
          <Box width={"800px"}sx={{ m:4 ,borderRadius: '16px',border: '2px solid #000',p: 4}}>
            
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              Yêu cầu
            </Typography>
            <ChartComponent labels={list} dataset1={list1}/>;
          </Box>
          {/* <Card sx={{ width: 400, height: 200 , m : 2 , border : "1px solid black", boxShadow : 16}}>
            <CardActionArea >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography gutterBottom variant="h5"  >
                  Tổng Thiết bị hiện có : {number}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang sử dụng : {state1}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang sẵn có : {state2}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang tạm dừng sử dụng : {state3}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card> */}

          {/* <Card sx={{ width: 400, height: 200, m : 2  , border : "1px solid black", boxShadow : 16}}>
            <CardActionArea >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography gutterBottom variant="h5">
                  Tổng Số Doanh mục hiện có : {categories.length}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Doanh mục nhìu thiết bị nhất : {state3}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Doanh mục ít thiết bị nhất : {state3}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card> */}
          {/* <Card sx={{ width: 400, height: 200 , m : 2 , border : "1px solid black", boxShadow : 16}}>
            <CardActionArea >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography gutterBottom variant="h5">
                  Tổng Số Yêu cầu đã thực hiện : {orders.length}

                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang sử dụng : {state01}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang sẵn có : {state02}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  Tổng thiết bị đang tạm dừng sử dụng : {state03}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card> */}
        </Grid>
          </Box>
          <Box
            mt = {4}
          >
            
            <Typography variant="h4" gutterBottom>
              Yêu cầu gần đây
            </Typography> 
            <TableContainer component={Paper} sx={{ width: "50%",maxHeight: "100%" ,borderRadius: '16px',border: '2px solid grey'}}>
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
                        <StyledTableRow sx={{height: "100px"}} key={item._id} hover>
                          <TableCell>{item._id}</TableCell>
                          <TableCell>{item.customer.name}</TableCell>
                          <TableCell>{new Date(item.cdate).toLocaleString()}</TableCell>
                          <TableCell>
                            <Box 
                                display="flex"
                                alignItems="center"
                                justifyContent="space-around"
                              >
                                {item.status === "APPROVED" ? (
                                <Typography gutterBottom variant="h6" >
                                  <CircleIcon color="success"/>
                                  Đã xử lý
                                </Typography>
                                ) : item.status === "PENDING" ? (
                                <Typography gutterBottom variant="h6" >
                                  <CircleIcon color="info"/>
                                  Đang chờ
                                </Typography>
                                ) : (
                                <Typography gutterBottom variant="h6" >
                                  <CircleIcon color="error"/>
                                  Đã huỷ bỏ
                                </Typography>
                                )}
                              </Box>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
          </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default Demo;
