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

const ClassDetail = (props) => {

  const [txtID, setTxtID] = useState("");
  const [txtRoom, setTxtRoom] = useState("");
  const [txtStair, setTxtStair] = useState("");
  const [txtZone, setTxtZone] = useState("");
  const [txtBuilding, setTxtBuilding] = useState("");




  useEffect(() => {
    if (props.item) {
      const { _id,  building, room, stair, zone } = props.item;
      setTxtZone(zone);
      setTxtID(_id);
      setTxtRoom(room);
      setTxtStair(stair);
      setTxtBuilding(building);
    }
  }, [props.item]);





  const btnAddClick = (e) => {
    e.preventDefault();
    const room = txtRoom.trim();
    const stair = txtStair.trim();
    const zone = txtZone.trim();;
    const building = txtBuilding.trim(); // Trim base64 building data

    if (zone && building && room && stair) {
      const prod = {
        zone: zone,
        building: building,
        room: room,
        stair: stair,
      };
      apiPostClass(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostClass = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("http://localhost:3000/api/admin/classes", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        console.log(result);
        alert("Class added successfully!");
        apiGetClass();
      } else {
        alert("Failed to add Class!");
      }
    });
  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const room = txtRoom;
    const stair = txtStair;
    const zone = txtZone;
    const building = txtBuilding;

    if (id && zone && building && room && stair && zone) {
      const prod = {
        building: building,
        room : room,
        stair : stair,
        zone : zone,
      };
      apiPutClass(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutClass = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("http://localhost:3000/api/admin/classes/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Class updated successfully!");
        apiGetClass();
      } else {
        alert("Failed to update Class!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this Class?")) {
      const id = txtID;
      if (id) {
        apiDeleteClass(id);
      } else {
        alert("Please select a Class to delete");
      }
    }
  };

  const apiDeleteClass = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("http://localhost:3000/api/admin/classes/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Class deleted successfully!");
        apiGetClass();
      } else {
        alert("Failed to delete Class!");
      }
    });
  };

  const apiGetClass = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/classes?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.classes.length !== 0) {
        props.apiPutClass(result.classes, result.noPages);
      } else {
        axios.get("http://localhost:3000/api/admin/classes?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.apiPutClass(result.classes, result.noPages);
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
        Class DETAIL
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
        <TextField
          width = "200px"
          label="room"
          value={txtRoom}
          onChange={(e) => {
            setTxtRoom(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="stair"
          value={txtStair}
          onChange={(e) => {
            setTxtStair(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
          <TextField
          width = "200px"
          label="zone"
          value={txtZone}
          onChange={(e) => {
            setTxtZone(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Building"
          value={txtBuilding}
          onChange={(e) => {
            setTxtBuilding(e.target.value);
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

export default ClassDetail;
