import React, { Component } from "react";
import { TextField, Button, Typography, Grid, Card, Box } from "@mui/material";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
    };
  }

  render() {
    if (JSON.parse(sessionStorage.getItem("token")) === null) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              ADMIN LOGIN
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Username"
                    value={this.state.txtUsername}
                    onChange={(e) => {
                      this.setState({ txtUsername: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={this.state.txtPassword}
                    onChange={(e) => {
                      this.setState({ txtPassword: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => this.btnLoginClick(e)}
                  >
                    LOGIN
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      );
    }
    return <div />;
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert("Please input username and password");
    }
  }

  apiLogin(account) {
    axios.post("/api/admin/login", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        sessionStorage.setItem("token", JSON.stringify(result.token));
        sessionStorage.setItem("username", JSON.stringify(account.username));
        window.location.href="/admin/home";
      } else {
        alert(result.message);
      }
    });
  }
}

export default Login;
