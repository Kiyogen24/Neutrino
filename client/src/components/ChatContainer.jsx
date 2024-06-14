import React, { useState, useEffect, useRef, useContext } from "react";
import ChatInput from "./ChatInput";
import { MessageContext } from '../Context/MessageContext';
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { CSSTransition } from 'react-transition-group';
import "./css/ChatContainer.css"
import { encryptMessage, decryptMessage, decryptPrivateKey } from '../crypto';

export default function ChatContainer({ currentChat, socket }) {
  const { msgs, setMsgs } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [data, setData] = useState(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [hasUserScrolledUp, setHasUserScrolledUp] = useState(false);
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(null);
  const [iv, setIv] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState(null);
  const [decryptedMessage, setDecryptedMessage] = useState('');

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

  const handleEncryptMessage = async (msg) => {
    if (!privateKey || !recipientPublicKey || !publicKey) return;

    const encryptedMessage1 = await encryptMessage(msg, recipientPublicKey);
    const encryptedMessage2 = await encryptMessage(msg, publicKey);

    return {encryptedMessage1, encryptedMessage2};
  };

  const handleDecryptMessage = async (msg) => {

    if (!privateKey) return;
    
    const decrypted = await decryptMessage(msg, privateKey);
    if (decrypted) {
    setDecryptedMessage(decrypted);
    }
    return decrypted;
  };

  useEffect(() => {
    const getMessage = async () => {
      let userData;
      let prk;
      if (!user) {
        userData = await JSON.parse(localStorage.getItem("app-user"));
        prk = await JSON.parse(localStorage.getItem("privateKey"));
        setData(userData);
        setPrivateKey(prk);
        setIv(userData.iv);
      } else {
        userData = await JSON.parse(user);
        prk = await JSON.parse(sessionStorage.getItem("privateKey"));
        setData(userData);
        setPrivateKey(prk);
        setIv(userData.iv);
      }
      setPublicKey(userData.publicKey);

      if (userData && currentChat) {
        const response = await axios.post(recieveMessageRoute, {
          from: userData._id,
          to: currentChat._id,
        });
        
        try {
          const decryptedMessages = await Promise.all(
            response.data.map(async msg => {
              if (msg.type === "picture") {
                return {
                  fromSelf: msg.fromSelf,
                  message: msg.message,
                  sentAt: msg.sentAt,
                  type: msg.type,
                };
              }
              else if (!msg.fromSelf){
                const decryptedMessage = await decryptMessage(msg.message, prk);
                return {
                  fromSelf: msg.fromSelf,
                  message: decryptedMessage,
                  sentAt: msg.sentAt,
                  type: msg.type,
                };
                } else {
                  const decryptedMessage = await decryptMessage(msg.cpy, prk);
                  return {
                    fromSelf: msg.fromSelf,
                    message: decryptedMessage,
                    sentAt: msg.sentAt,
                    type: msg.type,
                  };
                  }
                  
            })
          );
          console.log("mess : ", decryptedMessages);
          setMessages(decryptedMessages);
        } catch (error) {
          console.error("Error decrypting messages:", error);
        }
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
      setRecipientPublicKey(currentChatRef.current.publicKey)
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

  const toggleShowDate = (index) => {
    setMessages(messages.map((message, i) => i === index ? { ...message, showDate: !message.showDate } : message));
  }

  const handleSendMsg = async (msg, type) => {
    let userData;
    let prk;
    if (!user) {
      userData = await JSON.parse(localStorage.getItem("app-user"));

    }
    else {
      userData = await JSON.parse(user);
      
    }

    if (userData && currentChat) {
      let timestamp = new Date().getTime();
      if (type==='picture'){
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: userData._id,
          fromUser: userData.surname,
          msg: msg,
          type: type,
        }, userData);
        setIsTyping(false);
  
        await axios.post(sendMessageRoute, {
          from: userData._id,
          to: currentChat._id,
          message: msg,
          cpy : msg,
          type: type,
        });
      } else {

      const {encryptedMessage1, encryptedMessage2} = await handleEncryptMessage(msg);

      
      if (!encryptedMessage1) return;
      
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: userData._id,
        fromUser: userData.surname,
        msg: encryptedMessage1,
        type: type,
      }, userData);
      setIsTyping(false);

      await axios.post(sendMessageRoute, {
        from: userData._id,
        to: currentChat._id,
        message: encryptedMessage1,
        cpy : encryptedMessage2,
        type: type,
      });
    }
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

      socket.current.on("msg-recieve", async (data) => { 
        console.log("Received message");
        let timestamp = new Date().getTime();

        if (currentChatRef.current && data.from === currentChatRef.current._id) {
          if (data.type === 'picture'){
            setArrivalMessage({ fromSelf: false, message: data.msg, type: data.type, sentAt: timestamp, showDate: false });
          }
          else {
          const decryptedMsg = await handleDecryptMessage(data.msg);
          if (decryptedMsg) {
            setArrivalMessage({ fromSelf: false, message: decryptedMsg, type: data.type, sentAt: timestamp, showDate: false });
          }}
        } else {
          const img = `data:image/*;base64, ${profilePicture}`;
          const notification = new Notification("Nouveau Message", { body: `[${data.fromUser}] : ${data.msg}`, icon: img });
        }
      });
    }
  }, [socket, privateKey]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop + 75 < e.target.scrollHeight - e.target.offsetHeight) {
      setHasUserScrolledUp(true);
    } else {
      setHasUserScrolledUp(false);
    }
  };

  useEffect(() => {
    if (isMessageSent) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsMessageSent(false);
    }
  }, [isMessageSent]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);
  
  useEffect(() => {
    if (!hasUserScrolledUp) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  useEffect(() => {
    if (isTyping && !hasUserScrolledUp) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isTyping]);

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
