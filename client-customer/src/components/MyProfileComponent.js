import axios from "axios";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";

class Myprofile extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      txtName: "",
      txtPhone: "",
      txtEmail: "",
      error: {
        username: "",
        password: "",
        name: "",
        phone: "",
        email: "",
      },
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email,
      });
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // Update state with new input
    this.setState({
      [name]: value,
    });
  };

  validate = () => {
    let isError = false;
    const errors = {
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
    };

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } =
      this.state;

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

    this.setState({
      error: errors,
    });

    return isError;
  };

  onSubmit = (event) => {
    event.preventDefault();
    const err = this.validate();
    if (!err) {
      const customer = {
        username: this.state.txtUsername,
        password: this.state.txtPassword,
        name: this.state.txtName,
        phone: this.state.txtPhone,
        email: this.state.txtEmail,
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    }
  };

  apiPutCustomer = (id, customer) => {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/customer/customers/" + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
        this.context.setCustomer(result);
      } else {
        alert("SORRY BABY!");
      }
    });
  };

  render() {
    if (this.context.token === "") return <Navigate replace to="/login" />;
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
              <Box component="form" onSubmit={this.onSubmit} sx={{ mt: 3 }}>
                <TextField
                  label="Username"
                  fullWidth
                  name="txtUsername"
                  value={this.state.txtUsername}
                  onChange={this.handleInputChange}
                  margin="normal"
                  error={this.state.error.username !== ""}
                  helperText={this.state.error.username}
                />
                <TextField
                  label="Password"
                  fullWidth
                  name="txtPassword"
                  type="password"
                  value={this.state.txtPassword}
                  onChange={this.handleInputChange}
                  margin="normal"
                  error={this.state.error.password !== ""}
                  helperText={this.state.error.password}
                />
                <TextField
                  label="Name"
                  fullWidth
                  name="txtName"
                  value={this.state.txtName}
                  onChange={this.handleInputChange}
                  margin="normal"
                  error={this.state.error.name !== ""}
                  helperText={this.state.error.name}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  name="txtPhone"
                  type="tel"
                  value={this.state.txtPhone}
                  onChange={this.handleInputChange}
                  margin="normal"
                  error={this.state.error.phone !== ""}
                  helperText={this.state.error.phone}
                />
                <TextField
                  disabled
                  label="Email"
                  fullWidth
                  name="txtEmail"
                  type="email"
                  value={this.state.txtEmail}
                  onChange={this.handleInputChange}
                  margin="normal"
                  error={this.state.error.email !== ""}
                  helperText={this.state.error.email}
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
}

export default Myprofile;
