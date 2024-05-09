import React, { useState,  } from "react";
import {
  Box,
  Typography,

} from "@mui/material";

function Home() {
  const customer = JSON.parse(sessionStorage.getItem("customer"));
  return (
    <Box sx={{ mt: 4 }}>
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Chào mừng trở lại, {customer.name}
            </Typography>
          </Box>
        </>
    </Box>
  );
}

export default Home;
