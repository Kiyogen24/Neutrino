import React, { useState } from "react";
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
import Logo from "../../assets/neutrino.png";


const Sidenav = () => {

  const navigate = useNavigate();
  const [id, setId] = useState(undefined);

  const handleClick = async () => {
    const user = sessionStorage.getItem('app-user');
    if (!user) {
      setId(await JSON.parse(localStorage.getItem("app-user") ?? "")?._id ?? "");
    } else {
      setId(await JSON.parse(user)?.id ?? "");
    }
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
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
            <Menu iconShape="round" style = {{color: "white"}}>

              <MenuItem active={true} icon={<FaComment style={{ fontSize: '18px' }} />}>
                <Link to="/">Chat</Link>
              </MenuItem>
              <MenuItem icon={<FaUsers style={{ fontSize: '18px' }} />}>
                <Link to="/groups">Canal</Link>
              </MenuItem>
              {//<MenuItem icon={<FaPaperPlane style={{ fontSize: '18px' }} />}>Send Message</MenuItem>
              }
              
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="round" style = {{color: "white"}}>
              <MenuItem icon={<FaUserAstronaut style={{ fontSize: '18px' }} />}  onClick={handleClick}>
                Utilisateur
              </MenuItem>
              {//<MenuItem icon={<FiLogOut />} onClick={handleClick}>Logout</MenuItem>
              }
                
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Sidenav;
