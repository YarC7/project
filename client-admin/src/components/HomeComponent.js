import React, { Component } from "react";
import { Typography } from "@mui/material";

class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <Typography variant="h4" component="h2" align="center">
          ADMIN HOME
        </Typography>
        <div
          style={{
            width: "600px",
            height: "400px",
            paddingBottom: "45%",
            position: "relative",
          }}
          className="align-center"
        >
          <iframe
            src="https://giphy.com/embed/l1J9urAfGd3grKV6E"
            width="100%"
            height="100%"
            style={{ position: "absolute" }}
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
            title="Welcome Home Minions GIF"
          ></iframe>
        </div>
      </div>
    );
  }
}

export default Home;
