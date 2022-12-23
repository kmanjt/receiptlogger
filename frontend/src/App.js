import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ReceiptSubmit from './pages/ReceiptSubmit';
import Layout from './components/Layout';
import PrivateRoute from './hocs/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
    <Layout/>
    <Routes>
      
      <Route element={<PrivateRoute/>}>
      <Route index element={<Home />} exact/>
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/receiptsubmit" element={<ReceiptSubmit/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
