import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/register">Register</Link>
      <span> | </span>
      <Link to="/login">Login</Link>
      <span> | </span>
      <Link to="/receiptsubmit">Receipt Submit</Link>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default Layout;
