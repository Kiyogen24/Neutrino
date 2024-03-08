import React, { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { IoMdHappy } from "react-icons/io";
import { FaPaperPlane } from "react-icons/fa6";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg, socket  }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  let typingTimeout = null;

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      clearTimeout(typingTimeout); 
    }
  };

  const handleKeyDown = () => {
    setIsTyping(true); // Set typing status to true when key is pressed
    clearTimeout(typingTimeout); // Clear any existing typing timeout
    typingTimeout = setTimeout(() => {
      setIsTyping(false); // Set typing status to false after a delay
    }, 1000); // Adjust the delay as needed
    socket.current.emit("typing");
  };
  
  const handleKeyUp = () => {
    setIsTyping(false); // Set typing status to false when key is released
    clearTimeout(typingTimeout); // Clear any existing typing timeout
    typingTimeout = setTimeout(() => {
      socket.current.emit("stopTyping"); // Emit stopTyping event to server after a delay
    }, 2000); // Adjust the delay as needed  
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
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            type="text"
            placeholder="Votre message..."
            onChange={(e) => setMsg(e.target.value)}
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
  background-color: #101010;
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
        color: #ffff00c8;
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

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
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
      background-color: #03045F;
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