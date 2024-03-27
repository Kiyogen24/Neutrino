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
  const [privateKey, setPrivateKey] = useState(null); 
  

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem("app-user");
      if (!user) {
        user = sessionStorage.getItem("app-user");
      }
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(user));
        setRedirect(false);
        // Récupérez la clé privée de IndexedDB
        const privateKey = await getPrivateKeyFromIndexedDB(JSON.parse(user)._id);
        if (!privateKey) {
          // Si la clé privée n'est pas dans IndexedDB, générez une nouvelle paire de clés
          const keyPair = await generateKeys();
          // Stockez la clé privée dans IndexedDB
          await storePrivateKeyInIndexedDB(JSON.parse(user)._id, keyPair.privateKey);
          setPrivateKey(keyPair.privateKey);
        } else {
          setPrivateKey(privateKey);
        }
      }
    };

    fetchUser();
  }, []);



  async function getPrivateKeyFromIndexedDB(userId) {
    const db = await openIndexedDB();
    const tx = db.transaction("privateKeys", "readonly");
    const store = tx.objectStore("privateKeys");
    return store.get(userId);
  }

  async function storePrivateKeyInIndexedDB(userId, privateKey) {
    const db = await openIndexedDB();
    const tx = db.transaction("privateKeys", "readwrite");
    const store = tx.objectStore("privateKeys");
    await store.put(privateKey, userId);
    return tx.done;
  }

  async function openIndexedDB() {
    const db = await openDB("myApp", 1, {
      upgrade(db) {
        db.createObjectStore("privateKeys");
      },
    });
    return db;
  }

  async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    return keyPair;
  }


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
    <Sidebar />
    <div style={{display: "flex"}} className={menuCollapse === true ? "box collapsed" : "box"}>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} privateKey={privateKey} />
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
