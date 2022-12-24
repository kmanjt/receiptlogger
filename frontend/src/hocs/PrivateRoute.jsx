import { Route, Redirect, Routes, Outlet, Navigate } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children, ...rest }) => {
  const authenticated = false;

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
