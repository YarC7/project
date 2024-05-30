import React, { useState, useEffect ,useContext} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,MenuItem,FormControl,InputLabel,Select,OutlinedInput,Chip 
  
} from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function BillDetail(props) {
  const [txtID, setTxtID] = useState("");
  const [txtProducer, setTxtProducer] = useState("");
  const [txtCode, setTxtCode] = useState("");
  const [txtQuantity, setTxtQuantity] = useState("");
  const [txtTprice, setTxtTprice] = useState(0);
  const [txtPrice, setTxtPrice] = useState("");
  const [txtCdate, setTxtCdate] = useState(new Date());
  const [devices, setDevices] = useState([]);
  const [cmbDevice, setCmbDevice] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [totalPrices, setTotalPrices] = useState([]);
  useEffect(() => {
    if (props.item) {
      const { _id, producer, tprice , prices , cdate ,quantities, pid , code } = props.item;
      setTxtTprice(tprice);
      setTxtID(_id);
      setTxtProducer(producer);
      setQuantities(quantities);
      setTotalPrices(prices);
      setTxtCdate(cdate);
      setTxtCode(code);
      setCmbDevice(pid);
    }
  }, [props.item]);

  useEffect(() => {
    apiGetDevices();
    const newQuantities = {};
    const newTotalPrices = {};
    if (totalPrices.length >0 && quantities.length>0){
      totalPrices.forEach(pr => {
        newTotalPrices[pr.pid] = pr.price;
        setTotalPrices(newTotalPrices);

        
      })
      quantities.forEach(qu => {
        newQuantities[qu.pid] = qu.quantity;
        setQuantities(newQuantities);

      })
    }
    else {
      devices.forEach(product => {
        if (quantities[product._id]) {
          newQuantities[product._id] = quantities[product._id];
          newTotalPrices[product._id] = (product.price * quantities[product._id]) || 0;
        }
      });
    }

  }, [cmbDevice]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getSelectedProducts = () => {
    return cmbDevice.map(id => devices.find(product => product._id === id));
  };
  const handleQuantityChange = (productId, event) => {
    const value = event.target.value;
    if (!value) return;

    const newQuantities = {
      ...quantities,
      [productId]: value,
    };
    setQuantities(newQuantities);

    // Update total prices immediately after updating quantities
    const product = devices.find(p => p._id === productId);
    if (product) {
      const newTotalPrices = {
        ...totalPrices,
        [productId]: product.price * value,
      };
      setTotalPrices(newTotalPrices);
      
    }
  };

  useEffect(() => {
    // Calculate overall total price
    const total = Object.values(totalPrices).reduce((acc, price) => acc + price, 0);
    setTxtTprice(total);
  }, [totalPrices]);
  
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
    axios.get("http://localhost:3000/api/admin/devices", config).then((res) => {
      const result = res.data;
      setDevices(result);
    });
  };

  const btnAddClick = (e) => {
    e.preventDefault();
    const producer = txtProducer.trim();
    const lquantity = quantities;
    const code = txtCode.trim();
    const tprice = parseInt(txtTprice);
    const lprice = totalPrices;
    const cdate = (txtCdate);
    const device = getSelectedProducts();
    const pid = cmbDevice;
    const tempPrice = pid.map((id) => (
      {
        pid : id,
        price : lprice[id]
      }
    ));
    const tempQuantity = pid.map((id) => (
      {
        pid : id,
        quantity : lquantity[id]
      }
    ));
    if (producer && tempQuantity&&tempPrice && cdate && device && code) {
      const prod = {
        tprice: tprice,
        producer: producer,
        quantities: tempQuantity,
        prices: tempPrice,
        cdate: cdate,
        device: device,
        code : code,
        pid : pid
      };
      apiPostBill(prod);
      setTotalPrices([]);
      setQuantities([]);
      setCmbDevice([])
      setTxtProducer("");
      setTxtCode("");
      // console.log(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostBill = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("http://localhost:3000/api/admin/bill", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        
        alert("Bill added successfully!");
        console.log(result);
      } else {
        alert("Failed to add Bill!");
      }
    });

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
    axios.put("http://localhost:3000/api/admin/bill/" + id, prod, config).then((res) => {
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
    axios.delete("http://localhost:3000/api/admin/bill/" + id, config).then((res) => {
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
    axios.get("http://localhost:3000/api/admin/bill?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.bill.length !== 0) {
        props.updateBill(result.bill, result.noPages);
      } else {
        axios.get("http://localhost:3000/api/admin/bill?page=" + (props.curPage - 1), config).then((res) => {
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
            multiple
            value={cmbDevice}
            onChange={(e) => {
              // setCmbDevice(e.target.value);
              const {
                target: { value },
              } = e;
              setCmbDevice(
                // On autofill we get a stringified value.
                typeof value === 'string' ? value.split(',') : value,
              );
            }}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            label="Device"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {renderDevices}
          </Select>
          {getSelectedProducts().map((product) => (
            product ? (
              <Box>
                <TextField
                  key={product._id}
                  label={`Quantity for ${product.name}`}
                  type="number"
                  value={quantities[product._id] || ''}
                  onChange={(event) => handleQuantityChange(product._id, event)}
                  margin="normal"
                  sx={{ mt: 2 }}
                />
                <TextField
                  label={`Đơn giá for ${product.name}`}
                  type="number"
                  value={product.price}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6">
                  Tổng giá: {totalPrices[product._id] || 0}
                </Typography>

              </Box> 
            ) : null
          ))}
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
          label="Tổng giá tiền"
          readOnly
          value={txtTprice}
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
