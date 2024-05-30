import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

function PeriodDetail(props) {
  const [txtID, setTxtID] = useState("");
  const [txtIndex, setTxtIndex] = useState("");
  const [txtFrom, setTxtFrom] = useState("");
  const [txtTo, setTxtTo] = useState("");

  useEffect(() => {
    if (props.item) {
      const { _id, index, from, to } = props.item;
      setTxtTo(to);
      setTxtID(_id);
      setTxtIndex(index);
      setTxtFrom(from);
    }
  }, [props.item]);

  const btnAddClick = (e) => {
    e.preventDefault();
    const index = txtIndex.trim();
    const from = txtFrom.trim();
    const to = txtTo;

    if (to && index && from) {
      const prod = {
        to: to,
        index: index,
        from: from,
      };
      apiPostPeriod(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostPeriod = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("http://localhost:3000/api/admin/period", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        
        alert("Period added successfully!");
        apiGetPeriod();
      } else {
        alert("Failed to add Period!");
      }
    });
  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const index = txtIndex;
    const from = txtFrom;
    const to = txtTo;

    if (id && to && index && from && to) {
      const prod = {
        to: to,
        index: index,
        from: from,
      };
      apiPutPeriod(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutPeriod = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("http://localhost:3000/api/admin/period/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Period updated successfully!");
        apiGetPeriod();
      } else {
        alert("Failed to update Period!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this Period?")) {
      const id = txtID;
      if (id) {
        apiDeletePeriod(id);
      } else {
        alert("Please select a Period to delete");
      }
    }
  };

  const apiDeletePeriod = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("http://localhost:3000/api/admin/period/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Period deleted successfully!");
        apiGetPeriod();
      } else {
        alert("Failed to delete Period!");
      }
    });
  };

  const apiGetPeriod = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/period?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.length !== 0) {
        props.updatePeriod(result.period, result.noPages);
      } else {
        axios.get("http://localhost:3000/api/admin/period?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.updatePeriod(result.period, result.noPages);
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
        Period DETAIL
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
          width="200px"
          label="index"
          value={txtIndex}
          onChange={(e) => {
            setTxtIndex(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width="200px"
          label="from"
          value={txtFrom}
          onChange={(e) => {
            setTxtFrom(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width="200px"
          label="to"
          value={txtTo}
          onChange={(e) => {
            setTxtTo(e.target.value);
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
}

export default PeriodDetail;
