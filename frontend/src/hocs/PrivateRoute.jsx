import { Route, Redirect, Routes, Outlet } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children, ...rest }) => {
  console.log("private route works!");
  return <Outlet />;
};

export default PrivateRoute;
