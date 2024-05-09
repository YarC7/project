
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

function Myprofile() {
  const [ user, setUser ] = useState([]);
  const token = useState("");
  const [txtId , setId] = useState("");
  const [txtUsername, setTxtUsername] = useState("");
  const [txtPassword, setTxtPassword] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtPhone, setTxtPhone] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
  });

  

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("admin"))
    let token = JSON.parse(sessionStorage.getItem("token"))
    if (user) {
      setId(user._id);
      setTxtUsername(user.username);
      setTxtPassword(user.password);
      setTxtName(user.name);
      setTxtPhone(user.phone);
      setTxtEmail(user.email);
    }
  }, [user]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    switch (name) {
      case "txtUsername":
        setTxtUsername(value);
        break;
      case "txtPassword":
        setTxtPassword(value);
        break;
      case "txtName":
        setTxtName(value);
        break;
      case "txtPhone":
        setTxtPhone(value);
        break;
      case "txtEmail":
        setTxtEmail(value);
        break;
      default:
        break;
    }
  };

  const validate = () => {
    let isError = false;
    const errors = {
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
    };

    if (!txtUsername) {
      isError = true;
      errors.username = "Username is required";
    }

    if (!txtPassword) {
      isError = true;
      errors.password = "Password is required";
    }

    if (!txtName) {
      isError = true;
      errors.name = "Name is required";
    }

    if (!txtPhone) {
      isError = true;
      errors.phone = "Phone is required";
    }

    if (!txtEmail) {
      isError = true;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(txtEmail)) {
      isError = true;
      errors.email = "Invalid email format";
    }

    setError(errors);

    return isError;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const err = validate();
    if (!err) {
      const updatedCustomer = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail,
      };
      apiPutCustomer(txtId, updatedCustomer);
    }
  };

  const apiPutCustomer = (id, user) => {
    const config = { headers: { "x-access-token": JSON.parse(sessionStorage.getItem("token")) } };
    axios.put("/api/admin/user/" + id, user, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        sessionStorage.setItem('admin', JSON.stringify(result))
      } else {
        alert("SORRY BABY!");
        console.log(result);
      }
    });
  };

  if (token === "") return <Navigate replace to="/login" />;

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 3,
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              MY PROFILE
            </Typography>
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
              <TextField
                label="Username"
                fullWidth
                name="txtUsername"
                value={txtUsername}
                onChange={handleInputChange}
                margin="normal"
                error={error.username !== ""}
                helperText={error.username}
              />
              <TextField
                label="Password"
                fullWidth
                name="txtPassword"
                type="password"
                value={txtPassword}
                onChange={handleInputChange}
                margin="normal"
                error={error.password !== ""}
                helperText={error.password}
              />
              <TextField
                focused
                label="Name"
                fullWidth
                name="txtName"
                value={txtName}
                onChange={handleInputChange}
                margin="normal"
                error={error.name !== ""}
                helperText={error.name}
              />
              <TextField
                focused
                label="Phone"
                fullWidth
                name="txtPhone"
                type="tel"
                value={txtPhone}
                onChange={handleInputChange}
                margin="normal"
                error={error.phone !== ""}
                helperText={error.phone}
              />
              <TextField
                focused
                label="Email"
                fullWidth
                name="txtEmail"
                type="email"
                value={txtEmail}
                onChange={handleInputChange}
                margin="normal"
                error={error.email !== ""}
                helperText={error.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                UPDATE
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Myprofile;
