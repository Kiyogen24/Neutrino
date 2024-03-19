import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageToGroup, getGroupMessages, getGroupMembers } from "../utils/APIRoutes";
import Logout from "./Logout";
import "./css/ChatContainer.css"

export default function GroupChatContainer({ currentGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const currentGroupRef = useRef(currentGroup);
  const [groupMembers, setGroupMembers] = useState([]);
  
  useEffect(() => {
    currentGroupRef.current = currentGroup;
  }, [currentGroup]);
  
  const user = sessionStorage.getItem('app-user');
  useEffect(() => {
    const fetchGroupMessages = async () => {
      let userData;
      if (!user) {
        userData = await JSON.parse(localStorage.getItem("app-user"));
        setData(userData);
      } else {
        userData = await JSON.parse(user);
        setData(userData);
      }

      if (userData && currentGroup) {
        const response1 = await axios.post(getGroupMessages,{
          groupId: currentGroup._id,
          userId: userData._id,
        });
        setMessages(response1.data);

        const response2 = await axios.post(getGroupMembers,{
          groupId: currentGroup._id,
          userId: userData._id,
        });
        setGroupMembers(response2.data.members);
      }
    };

    fetchGroupMessages();
  }, [currentGroup]);
  



  const handleSendMsg = async (msg) => {
    if (!user) {
      setData(await JSON.parse(
        localStorage.getItem("app-user")
      ));
    }
    else {
      setData(await JSON.parse(user));
    }
    if (data && currentGroup) {
      let timestamp = new Date().getTime();
      socket.current.emit("send-msg-grp", {
        from: data._id,
        fromUser: data.username,
        to: currentGroup._id,
        members: groupMembers,
        msg,
      }, data);
      setIsTyping(false);
      await axios.post(sendMessageToGroup, {
        groupId: currentGroup._id,
        senderId: data._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg, sentAt: timestamp  });
      setMessages(msgs);
    }
  };


  
  useEffect(() => {
    if (socket.current) {
      socket.current.on("grp-typing", (groupId, groupMembers) => {
        if (currentGroupRef.current && groupId === currentGroupRef.current._id) {
          setIsTyping(true);
        }
      });

      socket.current.on("grp-stopTyping", (groupId, groupMembers) => {
        if (currentGroupRef.current && groupId === currentGroupRef.current._id) {
          setIsTyping(false);
        }
      });

      socket.current.on("msg-grp-recieve", (data) => {
        let timestamp = new Date().getTime();
        if (currentGroupRef.current && data.to === currentGroupRef.current._id) {
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
            <h3>{currentGroup.name}</h3>
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
        <ChatInput handleSendMsg={handleSendMsg} socket={socket} data={data} Group={[currentGroupRef.current._id, groupMembers]}/>
    </div>
   
  );
}

