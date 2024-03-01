import React, { useState } from "react";
//react pro sidebar components
import {ProSidebar,Menu,MenuItem,SidebarHeader,SidebarFooter,SidebarContent,} from "react-pro-sidebar";
//icons from react icons
import { FaList, FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { SiApacheairflow } from "react-icons/si";
import { GiAbstract050 } from "react-icons/gi";
//sidebar css from react-pro-sidebar module
import "react-pro-sidebar/dist/css/styles.css";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../../utils/APIRoutes";


const Sidenav = () => {
  //menuCollapse state using useState hook

  const [menuCollapse, setMenuCollapse] = useState(true)


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

  return (<><div id="header">{
    /* collapsed props to change menu size using menucollapse state */}
    <ProSidebar collapsed={menuCollapse}>
      <SidebarHeader>
      <div className="logotext" >
        {/* Icon change using menucollapse state */}
        <p>{menuCollapse ? <GiAbstract050 /> : <SiApacheairflow /> }</p>
        </div>

          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem active={true} icon={<FiHome />}>Home</MenuItem>
              <MenuItem icon={<FaList />}>Category</MenuItem>
              <MenuItem icon={<FaRegHeart />}>Favourite</MenuItem>
              <MenuItem icon={<BiCog />}>Settings</MenuItem>
              </Menu>
              </SidebarContent>
              <SidebarFooter>
                <Menu iconShape="square">
                  <MenuItem icon={<FiLogOut />} onClick={handleClick}>Logout</MenuItem>
                </Menu>
                </SidebarFooter>
              </ProSidebar>
            </div>
          </>
        );}
    export default Sidenav