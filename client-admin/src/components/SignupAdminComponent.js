import React, { Component } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import MyContext from "../contexts/MyContext";

class SignupAdmin extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      error: {
        username: "",
        password: "",
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
    };

    const { txtUsername, txtPassword } = this.state;

    if (!txtUsername) {
      isError = true;
      errors.username = "Username is required";
    }

    if (!txtPassword) {
      isError = true;
      errors.password = "Password is required";
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
      };
      this.apiSignup(account);
    }
  };

  apiSignup = (account) => {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/add-admin", account, config).then((res) => {
      const result = res.data;
      console.log(result);
      if (result.success) {
        alert(result.message);
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

export default SignupAdmin;
