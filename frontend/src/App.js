import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ReceiptSubmit from './pages/ReceiptSubmit';
import Layout from './components/Layout';
import PrivateRoute from './hocs/PrivateRoute';
import {AuthProvider} from './hocs/AuthContext';
import Appbar from './components/Appbar';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <Layout/>
    <Appbar/>
    <Routes>
      
      <Route element={<PrivateRoute/>}>
      <Route index element={<Home />} exact/>
      </Route>

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login/>} />

      <Route element={<PrivateRoute/>}>
      <Route path="/submit-receipt" element={<ReceiptSubmit/>} />
      </Route>
      
    </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
