import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList, FaComment, FaUser, FaPaperPlane,FaUserPlus, FaUserAstronaut, FaUsers } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { RiPencilLine } from "react-icons/ri";
import { SiApacheairflow } from "react-icons/si";
import { GiAbstract050 } from "react-icons/gi";
import "react-pro-sidebar/dist/css/styles.css";
import { useNavigate, Link } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../../utils/APIRoutes";
import SetAvatar from "../SetAvatar";
import Logo from "../../assets/neutrino.png";
import ProfilePicture from "../../assets/pp_user.png";

const Sidenav = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(undefined);
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [showPictureModal, setShowPictureModal] = useState(false);



  useEffect(() => {
    const verif = async () => {
        let user = localStorage.getItem("app-user");
        if (!user) {
            user = sessionStorage.getItem("app-user");
        }
        setUserData(JSON.parse(user));
    };
    verif();
  }, []);




  const handleClick = async () => {
    try {
    const data = await axios.get(`${logoutRoute}/${userData._id}`);
    if (data.status === 200) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  } catch (error) {
    console.error(error);
  }
  };

  const handleAvatarClick = () => {
    if (showPictureModal) {
      setShowPictureModal(false);
    } 
    else {
      setShowPictureModal(true);
    }
  };

  const handlePictureModalClose = () => {
      setShowPictureModal(false);
  };

  const handlePictureUpload = (event) => {
    // Handle picture upload logic here
  };

  return (
    <>
      <div id="header">
        <ProSidebar collapsed={true}>
          <SidebarHeader>
            <div className="logotext">
              <img src={Logo} alt="" style={{ width: '60px', height: 'auto' }} />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="round" style={{ color: "#101010" }}>
              <MenuItem  icon={<FaComment style={{ fontSize: '18px' }} />}>
                <Link to="/">Chat</Link>
              </MenuItem>
              <MenuItem icon={<FaUsers style={{ fontSize: '18px' }} />}>
                <Link to="/groups">Canal</Link>
              </MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="round" style={{  color: "white" }}>
              <MenuItem
                icon={profilePicture ? <img src={`data:image/png;base64, ${profilePicture}`} style={{ width: '70px', height: 'auto', fontSize: '18px' }} /> : <img src={ProfilePicture} style={{ width: '70px', height: 'auto', fontSize: '18px' }} />}
                onClick={handleAvatarClick}
              >
                Avatar
              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
            {showPictureModal && (
              <SetAvatar onClose={handlePictureModalClose} />
            )}
      </div>

      
    </>
  );
};

export default Sidenav;
