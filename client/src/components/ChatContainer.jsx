import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { CSSTransition } from 'react-transition-group';
import "./css/ChatContainer.css"



export default function ChatContainer({ currentChat, socket, privateKey }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [showDate, setShowDate] = useState(false);
  //const [isMessageClicked, setIsMessageClicked] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [hasUserScrolledUp, setHasUserScrolledUp] = useState(false);
  const [profilePicture, setProfilePicture] = useState(undefined);
  const user = sessionStorage.getItem('app-user');
  
  const currentChatRef = useRef(currentChat);
  
  const isGroup = false;
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  
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
      let decryptedMessageBuffer;
      try {
        decryptedMessageBuffer = await window.crypto.subtle.decrypt(
          {
            name: "RSA-OAEP",
          },
          privateKey,
          encryptedMessageBuffer
        );
      } catch (error) {
        console.error('Failed to decrypt message with window.crypto.subtle.decrypt:', error);
        continue; // Skip this iteration and move to the next message
      }
  
        // Convertir le message déchiffré en string
        const decryptedMessage = new TextDecoder().decode(new Uint8Array(decryptedMessageBuffer));
        
        decryptedMessages.push(decryptedMessage);
      } catch (error) {
        console.error('Failed to decrypt message:', encryptedMessage, error);
      }
    }
  
    return decryptedMessages;
  }



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
        setMessages(response.data.map(message => ({ ...message, showDate: false })));
        
      }
    }
    getMessage();
  }, [currentChat, user]); 

  useEffect(() => {
    const changeOn = async () => {
      if (currentChatRef.current  && currentChatRef.current.avatarImage !== "") {
        
        try {
          setProfilePicture(currentChatRef.current.avatarImage);
        } catch(err) {
          console.log(err); 
        }
      }
    };
    changeOn();
  }, [currentChatRef.current]);
  
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
  // Réinitialisez l'état isMessageClicked à false après un certain délai
  useEffect(() => {
    if (isMessageClicked) {
      setTimeout(() => {
        setIsMessageClicked(false);
      }, 1000);
    }
  }, [isMessageClicked]);
  */


    
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


const toggleShowDate = (index) => {
  setMessages(messages.map((message, i) => i === index ? { ...message, showDate: !message.showDate } : message));
  //setIsMessageClicked(true);
}

const handleSendMsg = async (msg, type) => {
  let userData;
  if (!user) {
    userData = await JSON.parse(localStorage.getItem("app-user"));
  }
  else {
    userData = await JSON.parse(user);
  }

  if (userData && currentChat) {
    let timestamp = new Date().getTime();
    //msg = await encryptMessage(data.publicKey, msg);
    
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: userData._id,
      fromUser: userData.surname,
      msg,
      type: type,
    }, userData);
    setIsTyping(false);
    await axios.post(sendMessageRoute, {
      from: userData._id,
      to: currentChat._id,
      message: msg,
      type: type,
    });
    
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, type: type, sentAt: timestamp, showDate: false });
    setMessages(msgs);
    setIsMessageSent(true);
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
        console.log("2");
        let timestamp = new Date().getTime();
        
        if (currentChatRef.current && data.from === currentChatRef.current._id) {
          setArrivalMessage({ fromSelf: false, message: data.msg, type: data.type, sentAt: timestamp, showDate: false });
        } else {
          const img = `data:image/*;base64, ${profilePicture}`;

          const text = data.msg;
          const notification = new Notification("Nouveau Message", { body: `[${data.fromUser}] : ${text}`, icon: img });
        }
      });
    }
  }, [socket]);


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop +75 < e.target.scrollHeight - e.target.offsetHeight) {
      setHasUserScrolledUp(true);
    } else {
      setHasUserScrolledUp(false);
    }
  };

  useEffect(() => {
    if (isMessageSent) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth"});
      setIsMessageSent(false); // Réinitialisez l'état isMessageSent à false après le défilement
    }
  }, [isMessageSent]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [currentChat]);
  
  useEffect(() => {
    if (!hasUserScrolledUp) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth"});
    }
  }, [messages]);
  
    useEffect(() => {
      if (isTyping && !hasUserScrolledUp) {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [isTyping]);
  /*
  useEffect(() => {
    if (!isMessageClicked) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth"});
    }
  }, [messages]);
  */
  

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  }


  return (
    <div className="Container">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
          <img src={`data:image/*;base64, ${profilePicture}`} />
          </div>
          <div className="username">
            <h3>{currentChat.surname}</h3>
            <h5>{'@'+currentChat.username}</h5>
          </div>
        </div>
        
      </div>
      <div className="chat-messages" onScroll={handleScroll}>
      {messages.sort((a, b) => a.sentAt - b.sentAt).map((message, index) => {
        const prevMessageTimestamp = index > 0 ? messages[index - 1].sentAt : null;
        const prevDate = prevMessageTimestamp ? new Date(prevMessageTimestamp).toLocaleDateString('fr-FR', options) : null;
        const currentDate = new Date(message.sentAt).toLocaleDateString('fr-FR', options);
        const today = new Date().toLocaleDateString('fr-FR', options);
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('fr-FR', options);
        const formattedDate = prevDate !== currentDate ? (currentDate === today ? "Aujourd'hui" : (currentDate === yesterday ? "Hier" : currentDate)) : null;
        return (
          <React.Fragment key={uuidv4()}>
            {prevDate !== currentDate && (
              <div className="date-notification">
                <p>{formattedDate}, {formatTime(message.sentAt)}</p>
              </div>
            )}
            <div ref={scrollRef}>
              <div 
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                  {message.type === "picture" ? (
                    <>
                    
                    <img onClick={() => toggleShowDate(index)} className="photoEnvoyee" style={{borderRadius: "1rem", maxHeight: "auto", maxWidth: "40%"}} src={`data:image/*;base64, ${message.message}`} alt="picture" />
                    
                    </>
                  ) : (
                    <>
                    <div className="content" onClick={() => toggleShowDate(index)}>
                      <p className="text">{message.message}</p>
                </div>
                    </>
                  )}
                  {message.showDate ? 
                    <p className="date">{formatTime(message.sentAt)}</p> 
                  : null}
              </div>
            </div>
          </React.Fragment>
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
