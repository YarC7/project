import React, { Component } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";

class Signup extends Component {
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
      const account = {
        username: this.state.txtUsername,
        password: this.state.txtPassword,
        name: this.state.txtName,
        phone: this.state.txtPhone,
        email: this.state.txtEmail,
      };
      this.apiSignup(account);
    }
  };

  apiSignup = (account) => {
    axios.post("http://localhost:3000/api/customer/signup", account).then((res) => {
      const result = res.data;
      if (result.success) {
        alert(result.message);
        this.props.history.push("/login");
      } else {
        alert(result.message);
      }
    });
  };

  render() {
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
                SIGN-UP
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    name="txtPassword"
                    value={this.state.txtPassword}
                    onChange={this.handleInputChange}
                    margin="normal"
                    error={this.state.error.password !== ""}
                    helperText={this.state.error.password}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    fullWidth
                    name="txtPhone"
                    value={this.state.txtPhone}
                    onChange={this.handleInputChange}
                    margin="normal"
                    error={this.state.error.phone !== ""}
                    helperText={this.state.error.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="txtEmail"
                    value={this.state.txtEmail}
                    onChange={this.handleInputChange}
                    margin="normal"
                    error={this.state.error.email !== ""}
                    helperText={this.state.error.email}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={this.onSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default Signup;
