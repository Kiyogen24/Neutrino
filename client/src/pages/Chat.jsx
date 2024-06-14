import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import { openDB } from 'idb';
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Sidebar from "../components/Navbar/Navbar.tsx";
import "./css/Chat.css"


export default function Chat({ menuCollapse }) {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirect, setRedirect] = useState(true)

  

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem("app-user");
      if (!user) {
        user = sessionStorage.getItem("app-user");
      }
      if (!user) {
        navigate("/login");
      } else {
        Notification.requestPermission().then((result) => {
          console.log("Notifications :", result);
        });
        setCurrentUser(JSON.parse(user));
        setRedirect(false);
        
      }
    };

    fetchUser();
  }, []);



  useEffect(() => {
        if (currentUser) {
          socket.current = io(host);
          socket.current.emit("add-user", currentUser._id);
        }
      }, [currentUser]);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    };
  
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    redirect === false ? (
    <div className="all">
      <div>
    <Sidebar />
    </div>
    <div style={{display: "flex"}} className={menuCollapse === true ? "box collapsed" : "box"}>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </div>) : (
                // Loading spinner
                // Credits – https://loading.io
                <div className="_0vzh">
                    <div className="clags-roe">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )
  );
}
