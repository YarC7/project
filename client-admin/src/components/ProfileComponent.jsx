import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";

function Myprofile() {
  const { customer, token, setCustomer } = useContext(MyContext);

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
    if (customer) {
      setTxtUsername(customer.username);
      setTxtPassword(customer.password);
      setTxtName(customer.name);
      setTxtPhone(customer.phone);
      setTxtEmail(customer.email);
    }
  }, [customer]);

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
      apiPutCustomer(customer._id, updatedCustomer);
    }
  };

  const apiPutCustomer = (id, customer) => {
    const config = { headers: { "x-access-token": token } };
    axios.put("/api/customer/customers/" + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        setCustomer(result);
      } else {
        alert("SORRY BABY!");
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
                disabled
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
