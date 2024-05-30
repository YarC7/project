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
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";
import ForgotPassword from "./ForgotPassword";

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      snackbarOpen: false,
      snackbarMessage: "",
      showForgotPassword: false,
    };
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Please input username and password",
      });
    }
  }

  apiLogin(account) {
    axios.post("http://localhost:3000/api/customer/login", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        sessionStorage.setItem("customer", JSON.stringify(result.customer));
        console.log(JSON.parse(sessionStorage.getItem("customer")));
        this.props.navigate("/home");
      } else {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: result.message,
        });
      }
    });
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  handleForgotPasswordClick = () => {
    this.setState({ showForgotPassword: true });
  };

  handleForgotPasswordClose = () => {
    this.setState({ showForgotPassword: false });
  };

  render() {
    return (
      <div className="align-center">
        {!this.state.showForgotPassword && (
          <Card sx={{ maxWidth: 400, margin: "auto", marginTop: 10 }}>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                style={{ textAlign: "center" }}
              >
                CUSTOMER LOGIN
              </Typography>
              <form onSubmit={(e) => this.btnLoginClick(e)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
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
                      label="Password"
                      type="password"
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
                      type="submit"
                    >
                      LOGIN
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={this.handleForgotPasswordClick}
                    >
                      FORGOT PASSWORD
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
        )}
        {this.state.showForgotPassword && (
          <ForgotPassword onClose={this.handleForgotPasswordClose} />
        )}
      </div>
    );
  }
}

export default withRouter(Login);
