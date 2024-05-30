import axios from "axios";
import { useContext, useState } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box, Modal
} from "@mui/material";
import { styled } from "@mui/material/styles";
import withRouter from "../utils/withRouter";
import UsedDetail from "./UsedDetailComponent";

const MyTable = styled(Table)({
  minWidth: 650,
});

const MyButton = styled(Button)({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const Mycart = ({ navigate }) => {
  const { mycart, setMycart, token, customer,used , setUsed } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const lnkRemoveClick = (id) => {
    const updatedCart = mycart.filter((item) => item.product._id !== id);
    setMycart(updatedCart);
  };

  const openUsedModal = () =>{
    handleOpen();
  }

  const lnkCheckoutClick = () => {
    if (used){
      console.log(used);
      console.log(mycart);
      if (window.confirm("ARE YOU SURE?")) {
        if (mycart.length > 0) {
          const total = CartUtil.getTotal(mycart);
          const items = mycart;
          if (customer) {
            setLoading(true);
            apiCheckout(total, items, customer,used);
          } else {
            navigate("/login");
          }
        } else {
          alert("Your cart is empty");
        }
      }
    }
    else {
      handleOpen();
    }
    
  };

  const apiCheckout = (total, items, customer,used) => {
    const body = { total: total, items: items, customer: customer , used : used };
    const config = { headers: { "x-access-token": token } };
    axios.post("http://localhost:3000/api/customer/checkout", body, config).then((res) => {
      const result = res.data;
      setLoading(false);
      if (result) {
        alert("OK BABY!");
        setMycart([]);
        setUsed(null);
        navigate("/home");
      } else {
        alert("SORRY BABY!");
      }
    });
  };

  return (
    <div>
      <Typography variant="h4" align="center">
        ITEM LIST
      </Typography>
      <TableContainer component={Paper}>
        <MyTable>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mycart.map((item, index) => (
              <TableRow key={item.product._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.product._id}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.category.name}</TableCell>
                <TableCell>
                  <img
                    src={"data:image/jpg;base64," + item.product.image}
                    width="70px"
                    height="70px"
                    alt=""
                  />
                </TableCell>
                <TableCell>{item.product.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product.price * item.quantity}</TableCell>
                <TableCell>
                  <MyButton
                    variant="contained"
                    disableElevation
                    onClick={() => lnkRemoveClick(item.product._id)}
                  >
                    Remove
                  </MyButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan="6" />
              <TableCell>Total</TableCell>
              <TableCell>{CartUtil.getTotal(mycart)}</TableCell>
              <TableCell>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <MyButton
                    variant="contained"
                    disableElevation
                    onClick={lnkCheckoutClick}
                  >
                    CHECKOUT
                  </MyButton>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </MyTable>
      </TableContainer>
      <Box sx={{ minWidth: "70%" }}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <UsedDetail/>
            </Box>
          </Modal>
        </Box>
    </div>
  );
};

export default withRouter(Mycart);
