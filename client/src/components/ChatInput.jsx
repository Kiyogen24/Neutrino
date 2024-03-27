import React, { useState, useRef } from "react";
import EmojiPicker from 'emoji-picker-react';
import { IoMdHappy } from "react-icons/io";
import { FaPaperPlane } from "react-icons/fa6";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg, socket, data, Group}) {
  const [msg, setMsg] = useState("");
  const typingTimeout = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      clearTimeout(typingTimeout);
      socket.current.emit("stopTyping", data._id); 
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      if (Group != null) {
        socket.current.emit("grp-typing", [Group[0], Group[1]])
      } else {
        socket.current.emit("typing", data._id);
      }
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      if (Group != null) {
        socket.current.emit("grp-stopTyping", [Group[0], Group[1]])
      } else {
        socket.current.emit("stopTyping", data._id);
      }
    }, 1000);
  };
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <IoMdHappy onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          {showEmojiPicker && (
            <div className={showEmojiPicker ? "emoji-picker-react show" : "emoji-picker-react"}>
              <EmojiPicker onEmojiClick={(emojiObject)=> {
                setMsg(msg + emojiObject.emoji);
                setShowEmojiPicker(false);
              }} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input 
          type="text"
          placeholder="Votre message..."
          onChange={(e) => {
            setMsg(e.target.value);
            handleTyping(); // Call handleTyping function when input value changes
          }}
          value={msg}
        />
        <button type="submit">
          <FaPaperPlane />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: hsla(0, 0%, 10%, 0);
    backdrop-filter: blur(12px);
    border: 1px solid hsla(0, 0%, 100%);
  padding: 0 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  @media screen and (max-width: 480px) {
    padding: 0 0.5rem;
    grid-template-columns: 10% 80% 10%;
    gap: 0.5rem;

    .button-container {
      .emoji {
        svg {
          font-size: 1.2rem;
        }

        .emoji-picker-react {
          top: -400px;

          .emoji-scroll-wrapper::-webkit-scrollbar {
            width: 3px;
          }
        }
      }
    }

    .input-container {
      input {
        font-size: 1rem;
        color: #03045F;
      }

      button {
        padding: 0.2rem 1rem;

        svg {
          font-size: 1.5rem;
        }
      }
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;

      svg {
        font-size: 1.5rem;
        color: #101010;
        cursor: pointer;
      }

      .emoji-picker-react {
        border-radius: 1rem;
        position: absolute;
        top: -470px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }

        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    border : 1px solid lightgrey;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: #101010;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #294C60;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #275EFE;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;

        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;