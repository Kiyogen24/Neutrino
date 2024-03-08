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
        console.log("localStorage.getItem('app-user'):", localStorage.getItem("app-user"));
        userData = await JSON.parse(localStorage.getItem("app-user"));
        setData(userData);
      } else {
        console.log("user:", user);
        userData = await JSON.parse(user);
        setData(userData);
      }
      
      if (userData && currentChat) {
        const response = await axios.post(recieveMessageRoute, {
          from: userData._id,
          to: currentChat._id,
        });
        setMessages(response.data);
        console.log(messages);
      }
    }
    getMessage();
  }, [currentChat, user]); 
  
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        if (!user) {
          console.log("localStorage.getItem('app-user'):", localStorage.getItem("app-user"));
          
          await JSON.parse(localStorage.getItem("app-user"))._id;
        } else {
          console.log("user:", user);
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
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    }
  };


  useEffect(() => {
    if (socket.current) {
      // Listen for typing event from other user
      socket.current.on("typing", () => {
        setIsTyping(true);
      });

      // Listen for stop typing event from other user
      socket.current.on("stopTyping", () => {
        setIsTyping(false);
        console.log("Other user stopped typing.");
      });

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



  return (
    <div className="Container">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
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
                  <p>{message.message}</p>
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
      <ChatInput handleSendMsg={handleSendMsg} socket={socket}/>
    </div>
   
  );
}
