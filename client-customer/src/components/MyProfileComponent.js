import axios from "axios";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import { Button, TextField, Typography, Box } from "@mui/material";

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
    };
  }
  render() {
    if (this.context.token === "") return <Navigate replace to="/login" />;
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h4" align="center">
          MY PROFILE
        </Typography>
        <Box component="form" onSubmit={this.btnUpdateClick} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={this.state.txtUsername}
            onChange={(e) => {
              this.setState({ txtUsername: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={this.state.txtPassword}
            onChange={(e) => {
              this.setState({ txtPassword: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            type="text"
            id="name"
            autoComplete="name"
            value={this.state.txtName}
            onChange={(e) => {
              this.setState({ txtName: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phone"
            label="Phone"
            type="tel"
            id="phone"
            autoComplete="phone"
            value={this.state.txtPhone}
            onChange={(e) => {
              this.setState({ txtPhone: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            type="email"
            id="email"
            autoComplete="email"
            value={this.state.txtEmail}
            onChange={(e) => {
              this.setState({ txtEmail: e.target.value });
            }}
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
      </Box>
    );
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
  // event-handlers
  btnUpdateClick = (e) => {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const customer = {
        username: username,
        password: password,
        name: name,
        phone: phone,
        email: email,
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert("Please input username and password and name and phone and email");
    }
  };
  // apis
  apiPutCustomer(id, customer) {
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
  }
}
export default Myprofile;
