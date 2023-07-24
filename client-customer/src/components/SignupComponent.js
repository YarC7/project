import axios from "axios";
import React, { Component } from "react";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

class Signup extends Component {
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
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          SIGN-UP
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <FormPaper>
              <TextField
                label="Username"
                fullWidth
                value={this.state.txtUsername}
                onChange={(e) => this.setState({ txtUsername: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={this.state.txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Name"
                fullWidth
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Phone"
                fullWidth
                value={this.state.txtPhone}
                onChange={(e) => this.setState({ txtPhone: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Email"
                fullWidth
                value={this.state.txtEmail}
                onChange={(e) => this.setState({ txtEmail: e.target.value })}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => this.btnSignupClick(e)}
                sx={{ mt: 3 }}
              >
                SIGN-UP
              </Button>
            </FormPaper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const account = { username, password, name, phone, email };
      this.apiSignup(account);
    } else {
      alert("Please input username, password, name, phone and email");
    }
  }

  // apis
  apiSignup(account) {
    axios.post("/api/customer/signup", account).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}

export default Signup;
