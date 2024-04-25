import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList, FaComment, FaUser, FaPaperPlane,FaUserPlus, FaUserAstronaut, FaUsers } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { RiPencilLine } from "react-icons/ri";
import { SiApacheairflow } from "react-icons/si";
import { GiAbstract050 } from "react-icons/gi";
import "react-pro-sidebar/dist/css/styles.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../../utils/APIRoutes";
import SetAvatar from "../SetAvatar";
import Logo from "../../assets/neutrino.png";
import ProfilePicture from "../../assets/pp_user.png";

const Sidenav = (importPP) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(undefined);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
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

  useEffect(() => {
    const changeOn = async () => {
      if (userData && userData.avatarImage !== "") {
        try {
          handleChangePP(userData.avatarImage);
        } catch(err) {
          console.log(err); 
        }
      }
    };
    changeOn();
  }, [userData]);

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
    } else {
      setShowPictureModal(true);
    }
  };

  const handleChangePP = (image) => {
    setProfilePicture(image);
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
      <ProSidebar collapsed={isSidebarCollapsed} >
          <SidebarHeader>
            <div className="logotext">
              <img src={Logo} alt="" style={{ width: '85px', height: 'auto', objectFit: 'cover' }} />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="round" style={{ color: "#101010"}}>
              <Link style={{ height:'24px'}} to="/">
                <MenuItem
                  icon={<div><div></div><a className="icon-meme"><FaComment style={{ fontSize: '30px' }} /></a></div>}
                  className={location.pathname === "/" ? "IconSelected" : ""}
                >
  
                </MenuItem>
              </Link>
              <Link style={{ height:'24px'}} to="/groups">
                <MenuItem
                  icon={<div><div ></div><a className="icon-meme"><FaUsers style={{ fontSize: '30px' }} /> </a></div>}
                  className={location.pathname === "/groups" ? "IconSelected" : ""}
                >
                  
                </MenuItem>
              </Link>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="circle" style={{ color: "white" }}>
              <MenuItem
                icon={
                    <img
                        src={`data:image/*;base64, ${profilePicture}`}
                        style={{
                          borderRadius: "3rem",
                          width: "3rem",
                          height: "3rem",
                          fontSize: "24px",
                          objectFit: "cover",
                        }}
                      />
                }
                onClick={handleAvatarClick}
              >
                Avatar
              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
            {showPictureModal && (
              <SetAvatar onClose={handlePictureModalClose} ChangePP={handleChangePP}/>
            )}
      </div>
    </>
  );
};

export default Sidenav;
