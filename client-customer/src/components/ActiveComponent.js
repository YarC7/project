import axios from "axios";
import React, { Component } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Card,
} from "@mui/material";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtToken: "",
      error: {
        id: "",
        token: "",
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
      id: "",
      token: "",
    };

    const { txtID, txtToken } = this.state;

    if (!txtID) {
      isError = true;
      errors.id = "ID is required";
    }

    if (!txtToken) {
      isError = true;
      errors.token = "Token is required";
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
      const id = this.state.txtID;
      const token = this.state.txtToken;
      this.apiActive(id, token);
    }
  };

  apiActive = (id, token) => {
    const body = { id: id, token: token };
    axios.post("http://localhost:3000/api/customer/active", body).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
      } else {
        alert("SORRY BABY!");
      }
    });
  };

  render() {
    return (
      <Box sx={{ mt: 4 }}>
        <Card sx={{ maxWidth: 400, margin: "auto", marginTop: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            ACTIVE ACCOUNT
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
            onSubmit={this.onSubmit}
          >
            <FormControl sx={{ mb: 2 }} error={this.state.error.id !== ""}>
              <TextField
                fullWidth
                label="ID"
                variant="outlined"
                name="txtID"
                value={this.state.txtID}
                onChange={this.handleInputChange}
                helperText={this.state.error.id}
              />
            </FormControl>
            <FormControl sx={{ mb: 2 }} error={this.state.error.token !== ""}>
              <TextField
                fullWidth
                label="Token"
                variant="outlined"
                name="txtToken"
                value={this.state.txtToken}
                onChange={this.handleInputChange}
                helperText={this.state.error.token}
              />
            </FormControl>
            <Button variant="contained" type="submit">
              ACTIVE
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default Active;
