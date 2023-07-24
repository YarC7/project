import React, { Component } from "react";
import { Typography } from "@mui/material";

class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <Typography variant="h4" component="h2" align="center">
          ADMIN HOME
        </Typography>
        <img
          src="http://cliparting.com/wp-content/uploads/2018/03/animated-emoticons-2018-13.gif"
          width="800px"
          height="600px"
          alt=""
        />
      </div>
    );
  }
}

export default Home;
