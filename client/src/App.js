import './App.css';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
=======
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Navbar from './components/Navbar/Navbar';

>>>>>>> d1a7133 (Update on frontend)

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
=======
    <Navbar />
      <Routes>
        <Route path="/" element={<Chat />} />
>>>>>>> d1a7133 (Update on frontend)
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
<<<<<<< HEAD
=======
    
    
>>>>>>> d1a7133 (Update on frontend)
  );
}

