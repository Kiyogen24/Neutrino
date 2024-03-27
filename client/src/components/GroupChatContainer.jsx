import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageToGroup, getGroupMessages, getGroupMembers } from "../utils/APIRoutes";
import "./css/ChatContainer.css";
import ProfilePicture from "../assets/pp_user.png";

export default function GroupChatContainer({ currentGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const currentGroupRef = useRef(currentGroup);
  const [groupMembers, setGroupMembers] = useState([]);

  // Generate a random color for each user's name
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    let isSimilar = true;
  
    while (isSimilar) {
      color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
  
      // Calculate the contrast ratio between the color and white
      const contrastWithWhite = getContrastRatio(color, "#FFFFFF");
             
      // Calculate the contrast ratio between the color and black
      const contrastWithBlack = getContrastRatio(color, "#000000");
  
      // Check if the contrast ratios are above a certain threshold
      if (contrastWithWhite >= 4.5 && contrastWithBlack >= 4.5) {
        isSimilar = false;
      }
      
    }
  
    return color;
  };  

  // Function to calculate the contrast ratio between two colors
  const getContrastRatio = (color1, color2) => {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
    return contrast;
  };
  
  // Function to calculate the relative luminance of a color
  const getLuminance = (color) => {
    const rgb = hexToRgb(color);
    const [r, g, b] = Object.values(rgb).map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance;
  };
  
  // Function to convert a hex color to RGB
  const hexToRgb = (color) => {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  };

  // Create a map to store the name-color pairs
  const nameColorMap = {};

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
      alert()
      socket.current.emit("send-msg-grp", {
        from: data._id,
        fromUser: data.surname,
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
      msgs.push({ fromSelf: true, fromUser:  data.surname, message: msg, sentAt: timestamp  });
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
          setArrivalMessage({ fromSelf: false, fromUser:  data.fromUser, message: data.msg, sentAt: timestamp });
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
          <div className="avatar"></div>
          <div className="username">
            <h3>{currentGroup.name}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => {
          // Generate a random color for each user's name if it doesn't exist in the map
          if (!nameColorMap[message.fromUser]) {
            nameColorMap[message.fromUser] = getRandomColor();
          }
          return (
            <div ref={index === messages.length - 1 ? scrollRef : null} key={uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                {!message.fromSelf && (
                  <div className="avatar" style={{ backgroundColor: nameColorMap[message.fromUser] }}></div>
                )}
                <div className="content">
                  {!message.fromSelf && (
                    <div className="surname">
                      <p style={{ color: nameColorMap[message.fromUser] }}>{message.fromUser}</p>
                    </div>
                  )}
                  <p className="text">{message.message}</p>
                  <p className="date">{formatTime(message.sentAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="typing">
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
          </div>
        )}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} socket={socket} data={data} Group={[currentGroupRef.current._id, groupMembers]} />
    </div>
  );
}