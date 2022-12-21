import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Layout from './components/Layout';
import ReceiptSubmit from './components/ReceiptSubmit';

function App() {
  return (
    <BrowserRouter>
    <Layout/>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/receiptsubmit" element={<ReceiptSubmit/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
