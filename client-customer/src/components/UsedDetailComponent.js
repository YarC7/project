import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import MyContext from "../contexts/MyContext";

const UsedDetail = (props) => {
  const [users, setUsers] = useState("");
  const [classes, setClasses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [txtID, setTxtID] = useState("");
  const [cmbDevice, setCmbDevice] = useState("");
  const [txtPurpose, setTxtPurpose] = useState("");
  const [txtTime, setTxtTime] = useState("");
  const [cmbUser, setCmbUser] = useState("");
  const [cmbClass, setCmbClass] = useState("");
  const [cmbPeriod, setCmbPeriod] = useState("");
  const [txtDesc, setTxtDesc] = useState("");
  const us = JSON.parse(sessionStorage.getItem("customer"));
  const { mycart, setMycart, token, customer , setUsed} = useContext(MyContext);
  const [pe, setPe] = useState(null);
  const [cl, setCl] = useState(null);

  useEffect(() => {
    apiGetDevices();
  }, []);


  useEffect(() => {
    apiGetClasses();
  }, []);
  useEffect(() => {
    apiGetPeriods();
  }, []);
  useEffect(() => {
    if (props.item) {
      const { _id, product, des,classes, purpose, time, teacher, periods } = props.item;
      setCmbDevice(product._id);
      setCmbUser(teacher._id);
      setCmbClass(classes?._id);
      setCmbPeriod(periods?._id);
      setTxtID(_id);
      setTxtPurpose(purpose);
      setTxtTime(time);
      setTxtDesc(des);
      setPe(periods);
      setCl(classes);
    }
  }, [props.item]);



  const renderClasses = classes?.map((cls) => (
    <MenuItem
      key={cls._id}
      value={cls}
      selected={cls._id === props.item?._id}
    >
      {"Phòng: "+cls.zone +cls.stair+ "." + cls.room+ " - " +"Cơ sở : "+ cls.building }
    </MenuItem>
    
  ));

  const renderDevices = devices?.map((dev) => (
    <MenuItem
      key={dev._id}
      value={dev._id}
      selected={dev._id === props.item?.product._id}
    >
      {dev.name}
    </MenuItem>
  ));

  const renderCarts = mycart?.map((item, index) => (
    <Box>
      <TextField id="outlined-basic" 
          label="Thiết bị" 
          variant="outlined" 
          defaultValue={item.product.name} 
          readOnly 
          InputProps={{
            readOnly: true,
          }}
      />
      <TextField id="outlined-basic" 
          label="Số lượng" 
          variant="outlined" 
          defaultValue={item.quantity} 
          readOnly 
          InputProps={{
            readOnly: true,
          }}
      />
    </Box>

    
  ));

  const renderPeriods = periods.map((pe) => (
    <MenuItem
      key={pe._id}
      value={pe}
      selected={pe._id === props.item?._id}
    >
      { "Tiết :"+ pe.index+ " từ " + pe.from + " đến " +pe.to}
    </MenuItem>
  ));



  const apiGetDevices = () => {
    axios.get("/api/customer/products/list").then((res) => {
      const result = res.data;
      setDevices(result);

    });
  };

  const apiGetClasses = () => {
    axios.get("/api/customer/class").then((res) => {
      const result = res.data;
      setClasses(result);

    });
  };

  const apiGetPeriods = () => {
    axios.get("/api/customer/period").then((res) => {
      const result = res.data;
      setPeriods(result);
    });
  };




  const btnAddClick = (e) => {
    e.preventDefault();
    const classes = cmbClass;
    const period = cmbPeriod;
    const purpose = txtPurpose.trim();
    const user = us;
    const des = txtDesc.trim(); // Trim base64 des data
    const items = mycart;
    if (items && des && purpose && user && classes && period) {
      const prod = {
        items: items,
        des: des,
        purpose: purpose,
        user: user,
        classes : classes,
        period : period,
      };
      console.log(prod)
      apiPostUsed(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostUsed = (prod) => {
    // const config = {
    //   headers: {
    //     "x-access-token": JSON.parse(sessionStorage.getItem("token")),
    //   },
    // };
    // axios.post("/api/admin/useds", prod, config).then((res) => {
    //   const result = res.data;
    //   if (result) {
    //     alert("Used added successfully!");
    //   } else {
    //     alert("Failed to add Used!");
    //   }
    // });
    // sessionStorage.setItem('used', JSON.stringify(prod))
    setUsed(prod);
    alert("Please checkout to conduct order!!!");
  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const classes = cmbClass;
    const id = txtID;
    const period = cmbPeriod;
    const device = cmbDevice;
    const purpose = txtPurpose;
    const teacher = cmbUser;
    const des = txtDesc;

    if (id && device && des && purpose && teacher && classes && period) {
      const prod = {
        device: device,
        period : period,
        des: des,
        purpose : purpose,
        classes : classes,
        teacher : teacher,
      };
      apiPutUsed(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutUsed = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("/api/admin/useds/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Used updated successfully!");
        apiGetUseds();
      } else {
        alert("Failed to update Used!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this Used?")) {
      const id = txtID;
      if (id) {
        apiDeleteUsed(id);
      } else {
        alert("Please select a User to delete");
      }
    }
  };

  const apiDeleteUsed = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("/api/admin/useds/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Used deleted successfully!");
        apiGetUseds();
      } else {
        alert("Failed to delete Used!");
      }
    });
  };

  const apiGetUseds = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/useds?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.useds.length !== 0) {
        props.updateUseds(result.useds, result.noPages);
      } else {
        axios.get("/api/admin/useds?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.updateUseds(result.useds, result.noPages);
        });
      }
    });
  };

  // Other API functions and event handlers...

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
        Used DETAIL
      </Typography>
      <Box component="form" sx={{
        '& .MuiTextField-root': { m: 2, width: '25ch' },
      }}>
        <TextField
          width = "200px"
          label="ID"
          value={txtID}
          InputProps={{ readOnly: true }}
          sx={{ m:1 ,width: '25ch' }}
        />

        <TextField id="outlined-basic" label="Giáo viên" variant="outlined" defaultValue={us.name} readOnly InputProps={{
            readOnly: true,
          }}/>
        {renderCarts}
        
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel>Lớp sử dụng</InputLabel>
          <Select
            defaultValue = ""
            value={cmbClass}
            onChange={(e) => {
              setCmbClass(e.target.value);
            }}
            label="Class"
          >
            {renderClasses}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel>Thời gian sử dụng</InputLabel>
          <Select
            defaultValue = ""
            value={cmbPeriod}
            onChange={(e) => {
              setCmbPeriod(e.target.value);
            }}
            label="Period"
          >
            {renderPeriods}
          </Select>
        </FormControl>
        <TextField
          width = "200px"
          label="Mục Đích"
          value={txtPurpose}
          onChange={(e) => {
            setTxtPurpose(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Ghi chú"
          value={txtDesc}
          onChange={(e) => {
            setTxtDesc(e.target.value);
          }}
          sx={{ mt: 2 }}
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
};

export default UsedDetail;
