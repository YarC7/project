import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { // global state
      // variables
      token: '',
      mycart: [],
      customer: null,
      used : null,
      bill : null,
      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
      setUsed: this.setUsed,
      setBill: this.setBill,


    };
  }
  setMycart = (value) => {
    this.setState({ mycart: value });
  }
  setToken = (value) => {
    this.setState({ token: value });
  }
  setCustomer = (value) => {
    this.setState({ customer: value });
  }
  setUsed = (value) => {
    this.setState({ used: value });
  }
  setBill = (value) => {
    this.setState({ bill: value });
  }
  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}
export default MyProvider;