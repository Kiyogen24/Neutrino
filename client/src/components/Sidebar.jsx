import React from 'react';
import { FaUser, FaComment } from 'react-icons/fa';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

const Sidebar = () => {
    return (
        <ProSidebar collapsed={true}>
            <Menu iconShape="square">
                <MenuItem icon={<FaUser />} >Users</MenuItem>
                <MenuItem icon={<FaComment />} >Chat</MenuItem>
            </Menu>
        </ProSidebar>
    );
};

export default Sidebar;
