import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import AuthContext from "../hocs/AuthContext";

const Layout = () => {
  let { contextData } = useContext(AuthContext);
  let { user } = contextData;
  let { logoutUser } = contextData;
  return (
    <div>
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/register">Register</Link>

      <span> | </span>
      <Link to="/submit-receipt">Submit Receipt</Link>
      <span> | </span>
      {user ? (
        <button onClick={logoutUser}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <br></br>
      <br></br>
      {user && <p> Welcome {user.username}</p>}

      <br></br>
      <br></br>
    </div>
  );
};

export default Layout;
