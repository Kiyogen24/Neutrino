import './App.css';
import {React, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Group from "./pages/Group"
//import Navbar from './components/Navbar/Navbar';
import { MessageContext } from './Context/MessageContext';


export default function App() {
  const [messages, setMessages] = useState({});

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/groups" element={<Group />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setavatar" element={<SetAvatar />} />
      </Routes>
    </BrowserRouter>
    </MessageContext.Provider>
    
    
  );
}

