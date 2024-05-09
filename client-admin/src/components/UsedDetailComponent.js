import React, { useState, useEffect } from "react";
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

const UsedDetail = (props) => {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [txtID, setTxtID] = useState("");
  const [cmbDevice, setCmbDevice] = useState("");
  const [txtPurpose, setTxtPurpose] = useState("");
  const [cmbUser, setCmbUser] = useState("");
  const [cmbClass, setCmbClass] = useState("");
  const [cmbPeriod, setCmbPeriod] = useState("");
  const [txtDesc, setTxtDesc] = useState("");

  useEffect(() => {
    apiGetDevices();
  }, []);


  useEffect(() => {
    apiGetUsers();
  }, []);

  useEffect(() => {
    apiGetClasses();
  }, []);
  useEffect(() => {
    apiGetPeriods();
  }, []);
  useEffect(() => {
    if (props.item) {
      const { _id, product, des,classes, purpose, teacher, periods } = props.item;
      setCmbDevice(product._id);
      setCmbUser(teacher._id);
      setCmbClass(classes?._id);
      setCmbPeriod(periods?._id);
      setTxtID(_id);
      setTxtPurpose(purpose);
      setTxtDesc(des);
    }
  }, [props.item]);

  const renderUsers = users.map((us) => (
    <MenuItem
      key={us._id}
      value={us._id}
      selected={us._id === props.item?.teacher._id}
    >
      {us.name}
    </MenuItem>
  ));

  const renderClasses = classes?.map((cls) => (
    <MenuItem
      key={cls._id}
      value={cls._id}
      selected={cls._id === props.item?._id}
    >
      {"Phòng: "+cls.zone +cls.stair+"."+ cls.room+" - "+"Cơ sở : "+ cls.building }
    </MenuItem>
    
  ));

  const renderDevices = devices.map((dev) => (
    <MenuItem
      key={dev._id}
      value={dev._id}
      selected={dev._id === props.item?.product._id}
    >
      {dev.name}
    </MenuItem>
  ));

  const renderPeriods = periods.map((pe) => (
    <MenuItem
      key={pe._id}
      value={pe._id}
      selected={pe._id === props.item?._id}
    >
      { "Tiết :"+ pe.index+ " từ " + pe.from + " đến " +pe.to}
    </MenuItem>
  ));

  const apiGetUsers = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/users/all", config).then((res) => {
      const result = res.data;
      setUsers(result);
    });
  };

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

  const apiGetClasses = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/class", config).then((res) => {
      const result = res.data;
      setClasses(result);

    });
  };

  const apiGetPeriods = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("/api/admin/period", config).then((res) => {
      const result = res.data;
      setPeriods(result);
    });
  };


  const btnAddClick = (e) => {
    e.preventDefault();
    const classes = cmbClass;
    const device = cmbDevice;
    const period = cmbPeriod;
    const purpose = txtPurpose.trim();
    const user = cmbUser;
    const des = txtDesc.trim(); // Trim base64 des data

    if (device && des && purpose && user && classes && period) {
      const prod = {
        device: device,
        des: des,
        purpose: purpose,
        user: user,
        classes : classes,
        period : period,
      };
      apiPostUsed(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostUsed = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("/api/admin/useds", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Used added successfully!");
        apiGetUsers();
      } else {
        alert("Failed to add Used!");
      }
    });
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
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel>Giảng viên</InputLabel>
          <Select
            defaultValue = ""
            value={cmbUser}
            onChange={(e) => {
              setCmbUser(e.target.value);

            }}
            label="User"
          >
            {renderUsers}
          </Select>
        </FormControl>
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
