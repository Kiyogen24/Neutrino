import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";



export default function Chat() {
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
    console.log(user);
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(user));
      setRedirect(false);
      console.log(user);
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
        console.log(data.data);
      }
    };
  
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    redirect === false ? (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
      
    </>) : (
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

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  .container {
    border-radius: 1rem;
    padding: 0.6rem;
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    ._0vzh {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  ._0vzh .clags-roe {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
  }
  ._0vzh .clags-roe div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: rgb(29, 49, 98);
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  
  ._0vzh .clags-roe div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
  }
  
  ._0vzh .clags-roe div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
  }
  
  ._0vzh .clags-roe div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
  }
  
  ._0vzh .clags-roe div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
  }
  
  @keyframes lds-ellipsis1 {
      0% {
          transform: scale(0);
      }
      100% {
          transform: scale(1);
      }
  }
  @keyframes lds-ellipsis3 {
      0% {
          transform: scale(1);
      }
      100% {
          transform: scale(0);
      }
  }
  @keyframes lds-ellipsis2 {
      0% {
          transform: translate(0, 0);
      }
      100% {
          transform: translate(24px, 0);
      }
  }
  }
`;
