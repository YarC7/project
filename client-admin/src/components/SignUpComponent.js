import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stack
} from "@mui/material";

const Signup = ({ history }) => {
  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let isError = false;
    const errors = {
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
    };

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = formData;

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

    setFormData({
      ...formData,
      error: errors,
    });

    return isError;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const err = validate();
    if (!err) {
      const account = {
        username: formData.txtUsername,
        password: formData.txtPassword,
        name: formData.txtName,
        phone: formData.txtPhone,
        email: formData.txtEmail,
      };
      apiSignup(account);
    }
  };

  const apiSignup = (account) => {
    axios.post("/api/admin/signup", account).then((res) => {
      const result = res.data;
      if (result.success) {
        alert(result.message);
        history.push("/login");
      } else {
        alert(result.message);
      }
    });
  };

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
            <form onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    fullWidth
                    name="txtUsername"
                    value={formData.txtUsername}
                    onChange={handleInputChange}
                    margin="normal"
                    error={formData.error.username !== ""}
                    helperText={formData.error.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    name="txtPassword"
                    value={formData.txtPassword}
                    onChange={handleInputChange}
                    margin="normal"
                    error={formData.error.password !== ""}
                    helperText={formData.error.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    name="txtName"
                    value={formData.txtName}
                    onChange={handleInputChange}
                    margin="normal"
                    error={formData.error.name !== ""}
                    helperText={formData.error.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    fullWidth
                    name="txtPhone"
                    value={formData.txtPhone}
                    onChange={handleInputChange}
                    margin="normal"
                    error={formData.error.phone !== ""}
                    helperText={formData.error.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="txtEmail"
                    value={formData.txtEmail}
                    onChange={handleInputChange}
                    margin="normal"
                    error={formData.error.email !== ""}
                    helperText={formData.error.email}
                  />
                </Grid>
              </Grid>
              <Stack sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 3, mb: 2}}
                >
                  Submit
                </Button>
              </Stack>
              
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
