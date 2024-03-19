import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import { allUsersRoute, getAllGroups, host, createGroupRoute } from "../utils/APIRoutes";
import GroupChatContainer from "../components/GroupChatContainer";
import GroupContacts from "../components/GroupContacts";
import Welcome from "../components/Welcome";
import Sidebar from "../components/Navbar/Navbar.tsx";


export default function GroupChat({ menuCollapse }) {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const socket = useRef();
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirect, setRedirect] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      let user = localStorage.getItem("app-user");
      if (!user) {
        user = sessionStorage.getItem("app-user");
      }
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(user));
        setRedirect(false);
      }
    };

    fetchUser();
  }, []);
      
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
      
  useEffect(() => {
    const fetchGroups = async () => {
      if (currentUser) {
        const response = await axios.get(`${getAllGroups}/${currentUser._id}`);
        setGroups(response.data.groups);
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    };
  
    fetchGroups();
  }, [currentUser]);

  const handleGroupChange = (group) => {
    setCurrentGroup(group);
  };
  
  return (
    redirect === false ? (
      <div className="all">
        <Sidebar />
        <div style={{display: "flex"}} className={menuCollapse === true ? "box collapsed" : "box"}>
          <div className="container">
            <GroupContacts contacts={contacts} groups={groups} changeGroup={handleGroupChange} />
            {currentGroup === undefined ? (
              <Welcome />
            ) : (
              <GroupChatContainer currentGroup={currentGroup} socket={socket} />
            )}
          </div>
        </div>
      </div>
    ) : (
      // Loading spinner
      // Credits – https://loading.io
      <div className="_0vzh">
        <div className="clags-roe">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  );
}
