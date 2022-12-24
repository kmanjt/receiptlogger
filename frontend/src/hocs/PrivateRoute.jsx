import { Route, Redirect, Routes, Outlet, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../hocs/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  let { contextData } = useContext(AuthContext);
  let { user } = contextData;

  return <>{user ? <Outlet /> : <Navigate to="/login" />};</>;
};

export default PrivateRoute;
