import React, { useState, useEffect ,useContext} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,MenuItem,FormControl,InputLabel,Select,
  Container
} from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyContext from "../contexts/MyContext";


function BillDetail(props) {
  const [txtID, setTxtID] = useState("");
  const [txtProducer, setTxtProducer] = useState("");
  const [txtCode, setTxtCode] = useState("");
  const [txtQuantity, setTxtQuantity] = useState("");
  const [txtTprice, setTxtTprice] = useState("");
  const [txtPrice, setTxtPrice] = useState("");
  const [txtCdate, setTxtCdate] = useState(new Date());
  const [devices, setDevices] = useState([]);
  const [cmbDevice, setCmbDevice] = useState("");
  const { setBill} = useContext(MyContext);

  useEffect(() => {
    if (props.item) {
      const { _id, producer, tprice , price , cdate ,quantity, product , code } = props.item;
      setTxtTprice(tprice);
      setTxtID(_id);
      setTxtProducer(producer);
      setTxtQuantity(quantity);
      setTxtPrice(price);
      setTxtCdate(cdate);
      setTxtCode(code);
      setCmbDevice(product._id);

    }
  }, [props.item]);

  useEffect(() => {
    apiGetDevices();
  }, []);

  const renderDevices = devices.map((dev) => (
    <MenuItem
      key={dev._id}
      value={dev._id}
      selected={dev._id === props.item?.product._id}
    >
      {dev.name}
    </MenuItem>
  ));

  const apiGetDevices = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/devices", config).then((res) => {
      const result = res.data;
      setDevices(result);
    });
  };

  const btnAddClick = (e) => {
    e.preventDefault();
    const producer = txtProducer.trim();
    const quantity = txtQuantity.trim();
    const code = txtCode.trim();
    const tprice = parseInt(txtTprice);
    const price = parseInt(txtPrice);
    const cdate = (txtCdate);
    const device = cmbDevice;

    if (producer && quantity&&price && cdate && device && code) {
      const prod = {
        tprice: tprice,
        producer: producer,
        quantity: quantity,
        price: price,
        cdate: cdate,
        device: device,
        code : code
      };
      apiPostBill(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostBill = (prod) => {
    // const config = {
    //   headers: {
    //     "x-access-token": JSON.parse(sessionStorage.getItem("token")),
    //   },
    // };
    // axios.post("/api/admin/bill", prod, config).then((res) => {
    //   const result = res.data;
    //   if (result) {
        
    //     alert("Bill added successfully!");
    //     apiGetPeriod();
    //   } else {
    //     alert("Failed to add Bill!");
    //   }
    // });
    setBill(prod);
    alert("Add Bill to product successfully");

  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const producer = txtProducer.trim();
    const quantity = txtQuantity.trim();
    const tprice = parseInt(txtTprice);
    const code = txtCode.trim();
    const price = parseInt(txtPrice);
    const cdate = txtCdate.trim();
    const device = cmbDevice;

    if (id && producer && quantity&&price && cdate && device && code) {
      const prod = {
        tprice: tprice,
        producer: producer,
        quantity: quantity,
        price: price,
        code : code,
        cdate: cdate,
        device: device,
      };
      apiPutBill(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutBill = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/bill/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Bill updated successfully!");
        apiGetPeriod();
      } else {
        alert("Failed to update Bill!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this Bill?")) {
      const id = txtID;
      if (id) {
        apiDeletePeriod(id);
      } else {
        alert("Please select a Bill to delete");
      }
    }
  };

  const apiDeletePeriod = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("/api/admin/bill/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Bill deleted successfully!");
        apiGetPeriod();
      } else {
        alert("Failed to delete Bill!");
      }
    });
  };

  const apiGetPeriod = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/bill?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.bill.length !== 0) {
        props.updateBill(result.bill, result.noPages);
      } else {
        axios.get("/api/admin/bill?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.updateBill(result.bill, result.noPages);
        });
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bill DETAIL
      </Typography>
      <Box component="form" sx={{
        '& .MuiTextField-root': { m: 2, width: '25ch' },
      }}>
        <TextField
          width="200px"
          label="ID"
          value={txtID}
          InputProps={{ readOnly: true }}
          sx={{ m: 1, width: '25ch' }}
        />
        <TextField
          fullWidth
          label="Mã Hoá Đơn"
          value={txtCode}
          onChange={(e) => {
            setTxtCode(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel>Thiết bị</InputLabel>
          <Select
            defaultValue = ""
            value={cmbDevice}
            onChange={(e) => {
              setCmbDevice(e.target.value);

            }}
            label="Device"
          >
            {renderDevices}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Nhà cung cấp"
          value={txtProducer}
          onChange={(e) => {
            setTxtProducer(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width="200px"
          label="Số Lượng"
          value={txtQuantity}
          onChange={(e) => {
            setTxtQuantity(e.target.value);
            setTxtTprice(txtPrice*e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width="200px"
          label="Đơn giá"
          value={txtPrice}
          onChange={(e) => {
            setTxtPrice(e.target.value);
            setTxtTprice(e.target.value*txtQuantity);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width="200px"
          label="Tổng giá tiền"
          readOnly
          value={txtTprice}
          onChange={(e) => {
            setTxtTprice(txtPrice**txtQuantity);
          }}
          sx={{ mt: 2 }}
        />
        <Typography className="text-date">Ngày mua</Typography>
        <DatePicker   label="Ngày mua"        
          selected={txtCdate}
          onChange={(txtCdate) => setTxtCdate(txtCdate)}
          wrapperClassName="datePicker"
        />




        <Box sx={{ m: 2 }}>
          <Button
            variant="contained"
            onClick={btnAddClick}
            sx={{ mr: 2 }}
          >
            ADD NEW
          </Button>
          <Button
            variant="contained"
            onClick={btnUpdateClick}
            sx={{ mr: 2 }}
          >
            UPDATE
          </Button>
          <Button variant="contained" onClick={btnDeleteClick}>
            DELETE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default BillDetail;
