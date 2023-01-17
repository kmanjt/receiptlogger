import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ReceiptSubmit from "./pages/ReceiptSubmit";
import Layout from "./components/Layout";
import PrivateRoute from "./hocs/PrivateRoute";
import { AuthProvider } from "./hocs/AuthContext";
import Appbar from "./components/Appbar";
import icon from "./assets/favicon.ico";
import Admin from "./pages/Admin";

function App() {
  // set the favicon to the icon in the assets folder
  useEffect(() => {
    const link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = icon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  // set the manifest to the manifest in the assets folder
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Appbar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route index element={<Home />} exact />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route path="/receipts" element={<ReceiptSubmit />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
