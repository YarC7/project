import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const UserDetail = (props) => {
  const [txtID, setTxtID] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtMajor, setTxtMajor] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPhone, setTxtPhone] = useState("");
  const [imgUser, setImgUser] = useState("");


  useEffect(() => {
    if (props.item) {
      const { _id, name, image , major , email , phone} = props.item;
      setTxtID(_id);
      setTxtName(name);
      setTxtMajor(major);
      setTxtEmail(email);
      setTxtPhone(phone);
      setImgUser("data:image/jpg;base64," + image);
    }
  }, [props.item]);


  const previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImgUser(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const btnAddClick = (e) => {
    e.preventDefault();
    const name = txtName.trim(); // Trim whitespace
    const major = txtMajor.trim();
    const email = txtEmail.trim();
    const phone = parseInt(txtPhone);
    const image = imgUser.replace(/^data:image\/[a-z]+;base64,/, "").trim(); // Trim base64 image data
  
    if (name && image && major && email && phone) {
      const prod = {
        name: name,
        image: image,
        major: major,
        email: email,
        phone: phone,
      };
      apiPostUser(prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPostUser = (prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.post("http://localhost:3000/api/admin/users", prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("User added successfully!");
        apiGetUsers();
      } else {
        alert("Failed to add User!");
      }
    });
  };

  const btnUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const name = txtName;
    const major = txtMajor;
    const email = txtEmail;
    const phone = txtPhone;
    const image = imgUser.replace(/^data:image\/[a-z]+;base64,/, "");

    if (id && name && image && major && email && phone) {
      const prod = {
        name: name,
        image: image,
        major : major,
        email : email,
        phone : phone,
      };
      apiPutUser(id, prod);
    } else {
      alert("Please input all required fields");
    }
  };

  const apiPutUser = (id, prod) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.put("http://localhost:3000/api/admin/users/" + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("User updated successfully!");
        apiGetUsers();
      } else {
        alert("Failed to update User!");
      }
    });
  };

  const btnDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this User?")) {
      const id = txtID;
      if (id) {
        apiDeleteUser(id);
      } else {
        alert("Please select a User to delete");
      }
    }
  };

  const apiDeleteUser = (id) => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.delete("http://localhost:3000/api/admin/users/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("User deleted successfully!");
        apiGetUsers();
      } else {
        alert("Failed to delete User!");
      }
    });
  };

  const apiGetUsers = () => {
    const config = {
      headers: {
        "x-access-token": JSON.parse(sessionStorage.getItem("token")),
      },
    };
    axios.get("http://localhost:3000/api/admin/users?page=" + props.curPage, config).then((res) => {
      const result = res.data;
      if (result.users.length !== 0) {
        props.updateUsers(result.users, result.noPages);
      } else {
        axios.get("http://localhost:3000/api/admin/users?page=" + (props.curPage - 1), config).then((res) => {
          const result = res.data;
          props.updateUsers(result.users, result.noPages);
        });
      }
    });
  };

  // Other API functions and event handlers...

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        User DETAIL
      </Typography>
      <Box component="form" sx={{
        '& .MuiTextField-root': { m: 2, width: '25ch' },
      }}>
        <TextField
          width = "200px"
          label="ID"
          value={txtID}
          InputProps={{ readOnly: true }}
          sx={{ m:1 ,width: '25ch' }}
        />
        <TextField
          width = "200px"
          label="Name"
          value={txtName}
          onChange={(e) => {
            setTxtName(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Major"
          value={txtMajor}
          onChange={(e) => {
            setTxtMajor(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Email"
          value={txtEmail}
          onChange={(e) => {
            setTxtEmail(e.target.value);
          }}
          sx={{ mt: 2 }}
        />
        <TextField
          width = "200px"
          label="Phone"
          value={txtPhone}
          onChange={(e) => {
            setTxtPhone(e.target.value);
          }}
          sx={{ mt: 2 }}
        />             
        <Box sx={{ m: 2 }}>
          <label htmlFor="file-upload">
            <img
              src={imgUser}
              width="300px"
              height="300px"
              alt=""
            />
            <input
              id="file-upload"
              type="file"
              name="fileImage"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => previewImage(e)}
              style={{ display: "none" }}
            />
            <div className="overlay">
              <i className="fa fa-plus"></i>
            </div>
          </label>
        </Box>
        <Box sx={{ m: 2 }}>
          <Button
            variant="contained"
            onClick={btnAddClick}
            sx={{ mr: 2 }}
          >
            ADD NEW
          </Button>
          <Button
            variant="contained"
            onClick={btnUpdateClick}
            sx={{ mr: 2 }}
          >
            UPDATE
          </Button>
          <Button variant="contained" onClick={btnDeleteClick}>
            DELETE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetail;
