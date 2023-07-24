import axios from "axios";
import React, { Component } from "react";
import { TextField, Button, Box, Typography, FormControl } from "@mui/material";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtToken: "",
    };
  }

  render() {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
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
          onSubmit={(e) => this.btnActiveClick(e)}
        >
          <FormControl sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="ID"
              variant="outlined"
              value={this.state.txtID}
              onChange={(e) => {
                this.setState({ txtID: e.target.value });
              }}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Token"
              variant="outlined"
              value={this.state.txtToken}
              onChange={(e) => {
                this.setState({ txtToken: e.target.value });
              }}
            />
          </FormControl>
          <Button variant="contained" type="submit">
            ACTIVE
          </Button>
        </Box>
      </Box>
    );
  }

  // event-handlers
  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert("Please input id and token");
    }
  }

  // apis
  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post("/api/customer/active", body).then((res) => {
      const result = res.data;
      if (result) {
        alert("OK BABY!");
      } else {
        alert("SORRY BABY!");
      }
    });
  }
}

export default Active;
