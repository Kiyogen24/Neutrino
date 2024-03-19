import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import "./css/ChatContainer.css"


export default function ChatContainer({ currentChat, socket, /*privateKey*/}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const user = sessionStorage.getItem('app-user');
  const currentChatRef = useRef(currentChat);
  const isGroup = false;


  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  /*
  async function decryptMessages(privateKey, encryptedMessages) {
    const decryptedMessages = [];
    for (let encryptedMessage of encryptedMessages) {
      try {
        // Vérifier que le message est une chaîne en base64 valide
        if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(encryptedMessage)) {
          throw new Error('encryptedMessage is not a valid base64 string');
        }
  
        // Convertir le message chiffré de base64 en ArrayBuffer
        const encryptedMessageBuffer = Uint8Array.from(
          atob(encryptedMessage),
          (c) => c.charCodeAt(0)
        );
        
        // Déchiffrer le message
        const decryptedMessageBuffer = await window.crypto.subtle.decrypt(
          {
            name: "RSA-OAEP",
          },
          privateKey,
          encryptedMessageBuffer
          );
  
        // Convertir le message déchiffré en string
        const decryptedMessage = new TextDecoder().decode(new Uint8Array(decryptedMessageBuffer));
        alert(decryptedMessage);
        decryptedMessages.push(decryptedMessage);
      } catch (error) {
        console.error('Failed to decrypt message:', encryptedMessage, error);
      }
    }
  
    return decryptedMessages;
  }
*/


  useEffect(() => {
    const getMessage = async () => {
      let userData;
      if (!user) {
        userData = await JSON.parse(localStorage.getItem("app-user"));
        setData(userData);
      } else {
        userData = await JSON.parse(user);
        setData(userData);
      }
      
      if (userData && currentChat) {
        const response = await axios.post(recieveMessageRoute, {
          from: userData._id,
          to: currentChat._id,
        });
        /*
        let messagesData = Object.values(response.data).map(item => item.message);
        console.log(messagesData);
        let decryptedMessages = await decryptMessages(privateKey, messagesData);
        console.log(decryptedMessages);
        setMessages(decryptedMessages);
        */
        setMessages(response.data);

      }
    }
    getMessage();
  }, [currentChat, user]); 
  
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        if (!user) {
          
          await JSON.parse(localStorage.getItem("app-user"))._id;
        } else {
          await JSON.parse(user)._id
        }
      }
    };
    getCurrentChat();
  }, [currentChat]);

    /*
  async function encryptMessage(publicKeyJwk, message) {
    // Importer la clé publique
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKeyJwk,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
      alert(publicKey);
    // Chiffrer le message
    const encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      new TextEncoder().encode(message)
    );
  
    // Convertir le message chiffré en base64 pour le rendre plus facile à manipuler
    return btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));
  }
*/


  const handleSendMsg = async (msg) => {
    if (!user) {
      setData(await JSON.parse(
        localStorage.getItem("app-user")
      ));
    }
    else {
      setData(await JSON.parse(user));
    }
    if (data && currentChat) {
      //msg = await encryptMessage(data.publicKey, msg);
      let timestamp = new Date().getTime();
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      }, data);
      setIsTyping(false);
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg, sentAt: timestamp  });
      setMessages(msgs);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("typing", (userId) => {
        if (currentChatRef.current && userId === currentChatRef.current._id) {
          setIsTyping(true);
        }
      });

      socket.current.on("stopTyping", (userId) => {
        if (currentChatRef.current && userId === currentChatRef.current._id) {
          setIsTyping(false);
        }
      });

      socket.current.on("msg-recieve", (data) => {
        let timestamp = new Date().getTime();
        if (currentChatRef.current && data.from === currentChatRef.current._id) {
          setArrivalMessage({ fromSelf: false, message: data.msg, sentAt: timestamp });
        }
      });
    }
  }, [socket]);


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isTyping]);


  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 24 || 24;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  }


  return (
    <div className="Container">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">

          </div>
          <div className="username">
            <h3>{currentChat.surname}</h3>
            <h5>{'@'+currentChat.username}</h5>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
            return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
              className={`message ${
                message.fromSelf ? "sended" : "recieved"
              }`}
              >
              <div className="content ">
                <p className="text">{message.message}</p>
                <p className="date">{formatTime(message.sentAt)}</p>
              </div>
              </div>
            </div>
            );
        })}
          {isTyping && <div className="typing">
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
        </div>}
      </div>
        <ChatInput handleSendMsg={handleSendMsg} socket={socket} data={data} Group={null}/>
    </div>
   
  );
}
