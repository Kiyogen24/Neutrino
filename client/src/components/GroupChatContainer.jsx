import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageToGroup, getGroupMessages } from "../utils/APIRoutes";

export default function GroupChatContainer({ currentGroup, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();



  useEffect(() => {
    const fetchGroupMessages = async () => {
      if (currentGroup) {
        const response = await axios.get(`${getGroupMessages}/${currentGroup._id}`);
        setMessages(response.data);
        console.log(response.data);
      }
    };

    fetchGroupMessages();
  }, [currentGroup]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [socket]);

  const handleSendMsg = async (msg) => {
    if (currentGroup) {
      socket.current.emit("send-msg", {
        groupId: currentGroup._id,
        senderId: currentGroup.members[0], // Change this to the sender's ID
        message: msg,
      });
      await axios.post(sendMessageToGroup, {
        groupId: currentGroup._id,
        senderId: currentGroup.members[0], // Change this to the sender's ID
        message: msg,
      });
    }
  };

  return (
    <Container>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={uuidv4()}>
            <div className="message">
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;

    .message {
      margin-bottom: 1rem;

      .content {
        padding: 0.5rem 1rem;
        background-color: #f2f2f2;
        border-radius: 0.5rem;
      }
    }
  }
`;
