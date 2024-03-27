import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid, TextField, Button , Stack} from '@mui/material';
import axios from 'axios'; // Assuming axios is installed
import { useNavigate } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = JSON.parse(sessionStorage.getItem('token'));
    setIsLoggedIn(storedToken !== null); // Check if user is already logged in
  }, []);

  const handleLoginClick = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    try {
      const account = { username, password };
      const response = await axios.post('/api/admin/login', account);
      const result = response.data;

      if (result.success) {
        sessionStorage.setItem('token', JSON.stringify(result.token));
        sessionStorage.setItem('username', JSON.stringify(username));
        setIsLoggedIn(true);
        window.location.href = '/admin';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
      {!isLoggedIn && ( // Conditionally render login form only if not logged in
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            ADMIN LOGIN
          </Typography>
          <form onSubmit={handleLoginClick}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
                <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                  <Button variant="contained" color="primary" type="submit">
                    LOGIN
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
          <Typography variant="h4" component="h2" align="center" gutterBottom>

          </Typography>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
            <Button  onClick={() => navigate("/signup")} variant="outlined">
              Register
            </Button>
          </Stack>
        </Card>
      )}
      {isLoggedIn && ( // Optionally render content for logged-in users here
        <div>You are logged in!</div>
      )}
    </Box>
  );
}

export default Login;