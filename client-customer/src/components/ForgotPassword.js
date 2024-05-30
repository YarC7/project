import React, { Component } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      snackbarOpen: false,
      snackbarMessage: "",
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.state.email;
    if (email) {
      axios
        .post("http://localhost:3000/api/customer/forgot", { email })
        .then((res) => {
          const result = res.data;
          if (result.success === true) {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Password reset email sent successfully!",
            });
          } else {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "An error occurred. Please try again later.",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            snackbarOpen: true,
            snackbarMessage: "An error occurred. Please try again later.",
          });
        });
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Please input email",
      });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    return (
      <Card sx={{ maxWidth: 400, margin: "auto", marginTop: 10 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
            FORGOT PASSWORD
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" type="submit">
                  SEND RESET PASSWORD EMAIL
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={this.props.onClose}
                >
                  CANCEL
                </Button>
              </Grid>
            </Grid>
          </form>
          <Snackbar
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.handleSnackbarClose}
            message={this.state.snackbarMessage}
          />
        </CardContent>
      </Card>
    );
  }
}

export default ForgotPassword;
