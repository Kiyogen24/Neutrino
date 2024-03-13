import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import "./css/ChatContainer.css"


export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const user = sessionStorage.getItem('app-user');


  

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
      const timestamp = new Date().getTime();
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
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
      // Listen for typing event from other user
      socket.current.on("typing", (userId) => {
        if (userId === currentChat._id) {
          setIsTyping(true);
    }});

      // Listen for stop typing event from other user
      socket.current.on("stopTyping", (userId) => {
        if (userId === currentChat._id) {
          setIsTyping(false);
    }});

      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
        console.log("Sent");
      });
    }
  }, []);


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);


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
        <ChatInput handleSendMsg={handleSendMsg} socket={socket} data={data}/>
    </div>
   
  );
}
